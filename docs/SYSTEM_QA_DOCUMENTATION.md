# FieldSync — System Architecture, Authentication & Database Design (Q&A)

This document explains how FieldSync actually works under the hood, in plain
language, with the exact file and line references for every claim so you can
open the code and follow along. It is organized into the three areas you
asked about: **System Architecture**, **Authentication & Authorization**, and
**Database Design**.

---

## 1. System Architecture

### What kind of architecture does FieldSync use?

FieldSync is a **client–server architecture**: a single-page React frontend
(the "client") talks over HTTP to a single Node.js/Express backend (the
"server"), which in turn talks to a MongoDB database.

It is **not** a classic server-rendered MVC app (no `.ejs`/`.pug` views, no
server-side templating). Instead:

- The **frontend** (`fieldsync/frontendui`) is a React + Vite single-page
  application (SPA). It owns all UI rendering and routing.
- The **backend** (`fieldsync/backend`) is an Express server that exposes a
  single **GraphQL API** endpoint. It owns business logic, validation,
  authentication, and database access.
- The **database** is MongoDB, accessed through Mongoose models.

You can still map the backend onto an MVC-like mental model if that helps for
your defense:
- **Models** → Mongoose schemas in [backend/src/models/](../backend/src/models/) (`User.js`, `Job.js`, `Notification.js`)
- **Controllers** → GraphQL resolvers in [backend/src/graphql/resolvers/](../backend/src/graphql/resolvers/) (these contain the actual logic that responds to a request)
- **Views** → there are none on the backend; the "view" is rendered entirely by the React frontend from JSON data

### How do the frontend and backend communicate?

They communicate over **HTTP**, exchanging **JSON**, using **GraphQL** as the
query language/protocol layered on top of HTTP.

Concretely:

1. The Express app is created and configured with JSON body-parsing and CORS:

```javascript
// backend/src/app.js (lines 1–10)
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

module.exports = app;
```

2. A single GraphQL endpoint, `/graphql`, is mounted on that Express app:

```javascript
// backend/src/server.js (lines 37–45)
app.use(
  "/graphql",

  expressMiddleware(server, {
    context: async ({ req }) => ({
      user: await authMiddleware({ req }),
    }),
  }),
);
```

3. On the frontend, **all** data requests — whether through Apollo Client or a
   raw `fetch` — are POSTed as JSON to that same `/graphql` path:

```javascript
// frontendui/src/services/apolloClient.js (lines 4–6)
const httpLink = createHttpLink({
  uri: "/graphql",
});
```

```javascript
// frontendui/src/shared/context/AuthContext.jsx (lines 29–33)
const res = await fetch("/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query, variables: { email, password } }),
});
```

So instead of many REST endpoints (`/jobs`, `/users/:id`, `/notifications`,
…), FieldSync has **one** endpoint that accepts a "query" or "mutation"
describing exactly what data is needed, and returns exactly that — no more,
no less — as JSON.

### What is the tech stack?

| Layer | Technology | Where to see it |
|---|---|---|
| Frontend | React + Vite, Apollo Client (GraphQL client), React Router, Tailwind CSS | [frontendui/src/services/apolloClient.js](../frontendui/src/services/apolloClient.js) |
| Backend | Node.js, Express 5, Apollo Server 5 (GraphQL server) | [backend/src/server.js](../backend/src/server.js), [backend/src/app.js](../backend/src/app.js) |
| Database | MongoDB, accessed via Mongoose (an ODM — Object Document Mapper) | [backend/src/models/](../backend/src/models/) |
| Auth | JSON Web Tokens (JWT) + bcrypt password hashing | [backend/src/middleware/authMiddleware.js](../backend/src/middleware/authMiddleware.js), [backend/src/utils/generateToken.js](../backend/src/utils/generateToken.js) |
| Email | Nodemailer (SMTP) for transactional emails | [backend/src/services/emailService.js](../backend/src/services/emailService.js) |

This is confirmed directly in the dependency list:

```json
// backend/package.json (lines 14–26)
"dependencies": {
  "@apollo/server": "^5.5.1",
  "@as-integrations/express5": "^1.1.2",
  "bcryptjs": "^3.0.3",
  "cors": "^2.8.6",
  "dotenv": "^17.4.2",
  "express": "^5.2.1",
  "graphql": "^16.14.0",
  "jsonwebtoken": "^9.0.3",
  "mongodb": "^7.2.0",
  "mongoose": "^9.6.2",
  "nodemailer": "^8.0.10"
}
```

### Walk me through the complete login flow, end to end

This is the clearest way to see the whole architecture working together —
frontend → HTTP → backend → database → back again.

**Step 1 — User submits the login form (frontend).**
`LoginForm` collects the email/password and calls `login()` from
`AuthContext`:

```javascript
// frontendui/src/components/forms/LoginForm.jsx (lines 23–39)
async function handleSubmit(event) {
  event.preventDefault();
  setError("");
  setIsSubmitting(true);
  try {
    await new Promise((resolve) => setTimeout(resolve, 350));
    const userData = login(email, password);
    if (userData.role === "ADMIN")
      navigate("/admin/dashboard", { replace: true });
    if (userData.role === "TECHNICIAN")
      navigate("/tech/jobs", { replace: true });
  } catch {
    setError("Invalid email or password. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
}
```

**Step 2 — The frontend sends a GraphQL `login` mutation over HTTP as JSON.**

```javascript
// frontendui/src/shared/context/AuthContext.jsx (lines 21–33)
async function login(email, password) {
  const query = `mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user { id name email phone role mustChangePassword }
    }
  }`;

  const res = await fetch("/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { email, password } }),
  });
```

**Step 3 — The request lands on the Express/Apollo `/graphql` endpoint**, which
routes it to the `login` resolver function on the backend (this is the
"controller" that contains the actual logic):

```javascript
// backend/src/graphql/resolvers/userResolvers.js (lines 171–199)
login: async (_, args) => {
  try {
    const { email, password } = args;

    // find user
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    // compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    // generate token
    const token = generateToken(user);

    return {
      token,
      user,
    };
  } catch (error) {
    throw new Error(error.message);
  }
},
```

**Step 4 — The resolver queries MongoDB through Mongoose** (`User.findOne({
email })`), gets back the stored user document (including the bcrypt-hashed
password), and compares the submitted password against the hash using
`bcrypt.compare`.

**Step 5 — A JWT is generated** containing the user's id and role, signed with
a server-side secret:

```javascript
// backend/src/utils/generateToken.js (lines 3–17)
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );
};
```

**Step 6 — The backend returns `{ token, user }` as a JSON response.** The
frontend stores the token in `localStorage` and stores the user profile in
React state (and `localStorage`) so the app remembers who is logged in:

```javascript
// frontendui/src/shared/context/AuthContext.jsx (lines 44–54)
const { token, user: u } = payload;
if (token) localStorage.setItem("fieldsync_token", token);

return persistUser({
  id: u.id,
  email: u.email,
  phone: u.phone ?? null,
  role: u.role,
  name: u.name,
  mustChangePassword: !!u.mustChangePassword,
});
```

**Step 7 — Every subsequent request automatically attaches the token.** Apollo
Client's `authLink` reads the token from `localStorage` and adds it as an
`Authorization: Bearer <token>` header to every GraphQL request:

```javascript
// frontendui/src/services/apolloClient.js (lines 8–16)
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("fieldsync_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});
```

**Step 8 — On the backend, that header is decoded on every request** before
any resolver runs, turning the token back into a real `User` document that
gets attached to `context.user` (more on this in the Authentication section
below).

### What does a typical request–response cycle look like (e.g. creating a job)?

1. Admin fills in the "create job" form on the frontend.
2. Apollo Client sends a `createJob` GraphQL mutation as a JSON POST to
   `/graphql`, with the JWT attached in the `Authorization` header.
3. `authMiddleware` decodes the JWT and loads the admin's `User` document into
   `context.user`.
4. The `createJob` resolver checks the caller is an `ADMIN`
   (`authorizeRoles("ADMIN")(context.user)` — [jobResolvers.js:99](../backend/src/graphql/resolvers/jobResolvers.js#L99)),
   validates the technician and client IDs, then calls `Job.create(...)` to
   write a new document to MongoDB.
5. The resolver also triggers two emails (job-confirmation to the client,
   job-assignment to the technician — see
   [jobResolvers.js:128-138](../backend/src/graphql/resolvers/jobResolvers.js#L128-L138)),
   wrapped in `try/catch` so an email failure can never break job creation.
6. The newly created (and populated) job document is serialized to JSON and
   returned to the frontend.
7. Apollo Client updates its cache, and React re-renders the UI with the new
   job — no page reload.

### Why was this architecture chosen? Monolith vs. microservices?

FieldSync is a **monolith**: one backend codebase, one database, one
deployable unit, serving one GraphQL API. For a project of this size (a
handful of related entities — users, jobs, notifications — used by a small
number of roles), a monolith is the right call because:

- **Simplicity** — one codebase, one place to look for logic, one process to
  run and deploy. No network calls between internal services, no distributed
  transactions to reason about.
- **Shared data model** — Jobs, Users, and Notifications are tightly coupled
  (a Job always references a Client and a Technician, who are both Users).
  Splitting these into separate services would mean constantly synchronizing
  data across service boundaries for very little benefit.
- **GraphQL fits a monolith well** — a single schema can describe the entire
  domain, and the client can fetch related data (e.g., a job *and* its
  technician *and* its client) in one round trip via `.populate()`-backed
  resolvers, instead of orchestrating multiple REST calls.

Microservices would only start to make sense if FieldSync needed independent
scaling of distinct subsystems (e.g., a high-traffic public booking service
separate from internal admin tools), independent deployment by separate
teams, or different technology choices per subsystem — none of which apply
here.

### What format is data transferred in?

**JSON** over **HTTP/HTTPS**, structured according to a **GraphQL schema**.
The schema defines exactly which "queries" (reads) and "mutations" (writes)
are available and what shape their inputs/outputs are — this is what makes
the contract between frontend and backend explicit and type-checked, even
though the wire format is still plain JSON.

### "What you should know" — quick definitions

- **HTTP/HTTPS** — the protocol browsers and servers use to exchange
  requests and responses; HTTPS is HTTP encrypted with TLS.
- **REST APIs** — an architectural style for web APIs based on resources and
  HTTP verbs (`GET /jobs`, `POST /jobs`, …). FieldSync does *not* use REST —
  it uses GraphQL, which exposes one endpoint and lets the client specify
  exactly what data it wants.
- **JSON** (JavaScript Object Notation) — the lightweight text format used to
  represent the data sent back and forth (`{ "token": "...", "user": {...} }`).
- **Client–server architecture** — the frontend (client) and backend (server)
  are separate programs that communicate over a network; the client never
  talks to the database directly.
- **MVC pattern** — Model (data/schema), View (UI), Controller (logic that
  connects the two). FieldSync's backend maps onto Models (Mongoose schemas)
  and Controllers (GraphQL resolvers); the View lives entirely in the React
  frontend.

---

## 2. Authentication and Authorization

### How do technicians (and admins) log in?

Everyone — admin or technician — logs in through the **same** `login`
mutation and the **same** `LoginForm` component. There is no separate login
path per role; the *role* is simply a field stored on the `User` document
(`ADMIN`, `TECHNICIAN`, or `CLIENT`) and is returned as part of the login
response, after which the frontend redirects based on that role:

```javascript
// frontendui/src/components/forms/LoginForm.jsx (lines 11–15)
useEffect(() => {
  if (!isAuthenticated) return;
  const path = user?.role === "ADMIN" ? "/admin/dashboard" : "/tech/jobs";
  navigate(path, { replace: true });
}, [isAuthenticated, user, navigate]);
```

There is also **no public registration** — accounts are provisioned only by an
admin (see `register` and `createTechnician` in
[userResolvers.js:37-126](../backend/src/graphql/resolvers/userResolvers.js#L37-L126)),
which is reflected directly in the UI copy:

```jsx
// frontendui/src/components/forms/LoginForm.jsx (line 181)
<p>No public registration · Accounts are provisioned by admin.</p>
```

### How is the username/password verified? Are passwords stored in plaintext?

**No — passwords are never stored in plaintext.** They are hashed with
**bcrypt** before being saved, and verified by comparing hashes, not raw
strings.

**At account creation** (admin registering a user, or provisioning a
technician), the plaintext password is hashed with `bcrypt.hash(password,
10)` — the `10` is the "salt rounds," i.e. how many times the hashing
algorithm runs, which controls how slow (and therefore brute-force-resistant)
the hash is to compute:

```javascript
// backend/src/graphql/resolvers/userResolvers.js (lines 61–72)
// hash password
const hashedPassword = await bcrypt.hash(password, 10);

// create user
const user = await User.create({
  name,
  email,
  password: hashedPassword,
  role,
  phone: phone || null,
  address: address || null,
});
```

**At login**, the plaintext password the user typed is compared against the
stored hash with `bcrypt.compare`, which re-hashes the input internally and
checks if the hashes match — the original password is never decrypted
(bcrypt hashes cannot be reversed):

```javascript
// backend/src/graphql/resolvers/userResolvers.js (lines 182–187)
// compare passwords
const isMatch = await bcrypt.compare(password, user.password);

if (!isMatch) {
  throw new Error("Invalid credentials");
}
```

The `User` schema simply stores the resulting hash as a plain string field —
there is no plaintext password column anywhere:

```javascript
// backend/src/models/User.js (lines 18–21)
password: {
  type: String,
  required: true
},
```

### What happens if the password is incorrect?

The `login` resolver throws `"Invalid credentials"` — and, importantly, it
throws the **exact same** message whether the *email* doesn't exist or the
*password* is wrong:

```javascript
// backend/src/graphql/resolvers/userResolvers.js (lines 176–187)
const user = await User.findOne({ email });

if (!user) {
  throw new Error("Invalid credentials");
}

const isMatch = await bcrypt.compare(password, user.password);

if (!isMatch) {
  throw new Error("Invalid credentials");
}
```

This is a deliberate security measure: if the system said "no account with
that email" vs. "wrong password," an attacker could use that difference to
discover which email addresses have accounts (this is called a **user
enumeration** vulnerability). Returning one generic message closes that hole.

On the frontend, this generic error is caught and shown to the user as:

```javascript
// frontendui/src/components/forms/LoginForm.jsx (line 35)
setError("Invalid email or password. Please try again.");
```

### How does the system know if someone is an admin or a technician?

Three layers, all driven by the single `role` field on the `User` document:

1. **At login**, the role is embedded directly into the signed JWT payload:

```javascript
// backend/src/utils/generateToken.js (lines 5–9)
return jwt.sign(
  {
    id: user._id,
    role: user.role
  },
  ...
```

2. **On every subsequent request**, `authMiddleware` decodes that token and
   loads the *full, current* `User` document from the database (not just the
   token's cached copy — so a role change takes effect immediately, without
   waiting for the token to expire):

```javascript
// backend/src/middleware/authMiddleware.js (lines 22–31)
// verify token
const decoded = jwt.verify(
  token,
  process.env.JWT_SECRET
);

// get user
const user = await User.findById(decoded.id);

return user;
```

   That `user` object — including its `role` — is attached to `context.user`
   for every resolver to use:

```javascript
// backend/src/server.js (lines 40–44)
expressMiddleware(server, {
  context: async ({ req }) => ({
    user: await authMiddleware({ req }),
  }),
}),
```

3. **Inside each resolver**, role checks gate access to sensitive operations.
   For example, only admins can create jobs:

```javascript
// backend/src/graphql/resolvers/jobResolvers.js (lines 98–99)
createJob: async (_, args, context) => {
  authorizeRoles("ADMIN")(context.user);
```

   …and a technician can only update the status of jobs assigned to *them*,
   and can never mark a job "VERIFIED" (only an admin can):

```javascript
// backend/src/graphql/resolvers/jobResolvers.js (lines 159–175)
// technician permissions
if (context.user.role === "TECHNICIAN") {
  // technician can only update assigned jobs
  if (job.technician.toString() !== context.user._id.toString()) {
    throw new Error("Not authorized for this job");
  }

  // technician cannot verify jobs
  if (status === "VERIFIED") {
    throw new Error("Technicians cannot verify jobs");
  }
}

// only admin can verify
if (status === "VERIFIED" && context.user.role !== "ADMIN") {
  throw new Error("Only admins can verify jobs");
}
```

### Definitions: Authentication vs. Authorization

- **Authentication** = "Who are you?" — proving identity. In FieldSync, this
  is the `login` mutation: you provide credentials, the server verifies them
  against the database and issues a JWT proving "this request comes from user
  X."
- **Authorization** = "What are you allowed to do?" — once we know who you
  are, deciding whether you can perform a given action. In FieldSync, this is
  `authorizeRoles(...)` ([roleMiddleware.js](../backend/src/middleware/roleMiddleware.js))
  and the inline role checks inside resolvers (e.g., "only ADMIN can create a
  job," "a technician can only touch their own jobs").

### How is unauthorized access to admin features prevented?

Every resolver that performs a privileged action calls
`authorizeRoles(...)` (or an equivalent inline check) **before** doing
anything else. The helper is a small factory function that throws if there is
no authenticated user, or if that user's role isn't in the allowed list:

```javascript
// backend/src/middleware/roleMiddleware.js (lines 1–13)
const authorizeRoles = (...roles) => {
  return (user) => {
    if (!user) {
      throw new Error("Not authenticated");
    }

    if (!roles.includes(user.role)) {
      throw new Error("Not authorized");
    }
  };
};
```

This is applied consistently across the job and user resolvers — for
instance, registering new accounts is admin-only:

```javascript
// backend/src/graphql/resolvers/userResolvers.js (lines 38–42)
// Account provisioning is admin-only — there is no public sign-up.
if (!context.user || context.user.role !== "ADMIN") {
  throw new Error("Not authorized");
}
```

Critically, this check happens **on the backend**, inside the resolver — not
just by hiding buttons in the UI. Even if someone bypassed the frontend
entirely and sent raw GraphQL requests, the server would still reject
unauthorized actions, because `context.user` is derived from a verified JWT,
not from anything the client claims about itself.

### What other security measures are in place?

- **Stateless JWT auth** — the server doesn't need to keep a session store;
  every request carries its own proof of identity (a signed token), verified
  with `jwt.verify` against `process.env.JWT_SECRET`
  ([authMiddleware.js:23-26](../backend/src/middleware/authMiddleware.js#L23-L26)).
  Tokens expire after 7 days (`expiresIn: "7d"` —
  [generateToken.js:14](../backend/src/utils/generateToken.js#L14)).
- **Generic error messages** for login failures, to prevent user enumeration
  (explained above).
- **Forced password change for new technician accounts** — when an admin
  provisions a technician, a random temporary password is generated with
  Node's `crypto` module and the account is flagged `mustChangePassword:
  true`, so the technician must set their own password on first login:

```javascript
// backend/src/graphql/resolvers/userResolvers.js (lines 105–117)
// generate a secure, random temporary password the admin can share
const temporaryPassword = crypto.randomBytes(9).toString("base64url");

const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

const user = await User.create({
  name,
  email,
  phone: phone || null,
  password: hashedPassword,
  role: "TECHNICIAN",
  mustChangePassword: true,
});
```

- **Re-verification on password change** — `changePassword` requires the
  user to prove they know their *current* password (via `bcrypt.compare`)
  before allowing a new one, and rejects re-using the same password:

```javascript
// backend/src/graphql/resolvers/userResolvers.js (lines 142–154)
const isMatch = await bcrypt.compare(currentPassword, user.password);

if (!isMatch) {
  throw new Error("Current password is incorrect");
}

if (!validatePassword(newPassword)) {
  throw new Error("Password must be at least 6 characters");
}

if (currentPassword === newPassword) {
  throw new Error("New password must be different from the current password");
}
```

- **Input validation** — emails and passwords are validated with
  `validateEmail`/`validatePassword` helpers
  ([userResolvers.js:8](../backend/src/graphql/resolvers/userResolvers.js#L8))
  before being persisted.
- **CORS** is enabled (`app.use(cors())` —
  [app.js:6](../backend/src/app.js#L6)) so only requests following the
  configured cross-origin policy are accepted by the browser.

### "What you should know" — quick definitions

- **Password hashing (bcrypt)** — a one-way function that turns a password
  into a fixed-length scrambled string (a "hash"). You can't reverse a hash
  back into the password; you can only hash a *new* guess and compare. This
  means that even if the database is leaked, raw passwords are not exposed.
- **Sessions or JWT tokens** — two common ways to keep a user "logged in"
  across requests. Sessions store login state on the server (with a session
  ID cookie); JWTs are self-contained signed tokens that the *client* stores
  and sends with each request, requiring no server-side storage. FieldSync
  uses **JWTs** (`localStorage.setItem("fieldsync_token", token)` —
  [AuthContext.jsx:45](../frontendui/src/shared/context/AuthContext.jsx#L45)).
- **User roles** — labels (`ADMIN`, `TECHNICIAN`, `CLIENT`) stored on each
  user that determine what they're allowed to do.
- **Access control** — the general practice of restricting what authenticated
  users can see/do based on who they are (their role, ownership of a
  resource, etc.).
- **Login flow** — the sequence: submit credentials → server verifies →
  server issues proof of identity (JWT) → client stores and reuses that proof
  on every future request.

---

## 3. Database Design

### Why MongoDB (and Mongoose)?

FieldSync uses **MongoDB**, a NoSQL **document database**, accessed through
**Mongoose** (an Object Document Mapper / ODM that adds schemas, validation,
and convenience methods on top of MongoDB's raw driver).

```javascript
// backend/src/models/User.js (line 1)
const mongoose = require("mongoose");
```

```
// backend/.env (line 1)
MONGO_URI=mongodb://localhost:27017/fieldsync
```

Reasons this fits FieldSync well:

- **Natural fit for JSON/GraphQL** — MongoDB stores JSON-like documents
  (BSON), and the GraphQL API already speaks JSON. Data flows from the
  database, through Mongoose, through GraphQL resolvers, to the frontend with
  almost no "shape translation" at any step.
- **Flexible schema for an evolving project** — Mongoose lets you define a
  schema (so you still get validation, types, and defaults — see below) while
  remaining easier to extend than a rigid SQL table during active
  development, e.g. adding a new optional field to `Job` doesn't require a
  migration.
- **Good fit for the access patterns here** — most reads are "get a job and
  the people related to it" (technician, client, creator), which Mongoose's
  `.populate()` handles cleanly by following `ObjectId` references — the
  NoSQL equivalent of a SQL join, performed at the application layer.

### What collections ("tables") exist, and what do they store?

There are **three** Mongoose models/collections:

**1. `User`** — stores admins, technicians, *and* clients in one collection,
distinguished by a `role` field. This avoids duplicating near-identical
fields (name, email, phone, address) across three separate tables:

```javascript
// backend/src/models/User.js (lines 3–49)
const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role:     { type: String, enum: ["ADMIN", "TECHNICIAN", "CLIENT"], required: true },
    phone:    { type: String, default: null, trim: true },
    address:  { type: String, default: null, trim: true },
    mustChangePassword: { type: Boolean, default: false }
  },
  { timestamps: true }
);
```

**2. `Job`** — the core work-order entity, with a status lifecycle and links
to the technician, client, and admin who created it:

```javascript
// backend/src/models/Job.js (lines 3–61)
const jobSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true },
    description: { type: String, required: true },
    location:    { type: String, required: true },
    status:      { type: String, enum: ["PENDING","IN_PROGRESS","COMPLETED","VERIFIED","CANCELLED"], default: "PENDING" },
    priority:    { type: String, enum: ["LOW","MEDIUM","HIGH"], default: "MEDIUM" },
    completionNote: { type: String, default: null },
    technician: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    client:     { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdBy:  { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);
```

**3. `Notification`** — short, in-app status messages tied to a client and a
job (these power the bell-icon notification list in the UI, separate from the
emails):

```javascript
// backend/src/models/Notification.js (lines 3–30)
const notificationSchema = new mongoose.Schema(
  {
    client:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    job:     { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    message: { type: String, required: true },
    isRead:  { type: Boolean, default: false }
  },
  { timestamps: true }
);
```

> **Note on "possible tables" you may have been expecting:** the design
> deliberately *merges* `Users`, `Technicians`, and `Clients` into a single
> `User` collection distinguished by `role` — there is no separate
> `Technicians`/`Clients` collection. There is also **no separate
> `JobStatusHistory` table** — a job's current status is stored as a single
> field (`status`) on the `Job` document itself, and changes are validated
> against an explicit lifecycle map rather than logged as historical rows
> (see "How are duplicate/invalid records prevented?" below). If a full audit
> trail of every status change becomes a requirement later, that *would* be
> the natural place to introduce a `JobStatusHistory` collection.

### How do these collections relate to each other? What are the "primary keys" and "foreign keys"?

MongoDB is NoSQL, so it doesn't have formal foreign-key constraints like SQL
does — but Mongoose models the same *relationships* using `ObjectId`
references (`ref: "User"`, `ref: "Job"`) plus `.populate()` to resolve them,
which is functionally the same idea as a SQL join on a foreign key.

- **Primary key** — every MongoDB document automatically gets a unique `_id`
  field (an `ObjectId`). This is the equivalent of a SQL primary key, and
  Mongoose/MongoDB generate and index it for you — you never define it
  manually.
- **Foreign key** — a field whose type is `mongoose.Schema.Types.ObjectId`
  with a `ref` pointing at another model. It stores the *primary key* (`_id`)
  of a document in another collection. For example, `Job.technician` stores
  the `_id` of a `User` document.

Relationships in FieldSync:

```
Client (User, role = CLIENT)
  |
  |----< Job >----|
                  |
            Technician (User, role = TECHNICIAN)

  • One client can have many jobs        → Job.client     references User._id
  • One technician can be assigned many jobs → Job.technician references User._id
  • One admin can create many jobs        → Job.createdBy  references User._id
  • One client receives many notifications → Notification.client references User._id
  • One job can generate many notifications → Notification.job references Job._id
```

These are defined as `ref` fields on the `Job` model (lines 43–56) and the
`Notification` model (lines 5–15) shown above. To actually fetch the related
documents (not just their IDs), resolvers call `.populate()`:

```javascript
// backend/src/graphql/resolvers/jobResolvers.js (lines 140–143)
return await Job.findById(job._id)
  .populate("technician")
  .populate("client")
  .populate("createdBy");
```

This is the NoSQL equivalent of a SQL `JOIN` — Mongoose performs a follow-up
query (or queries) behind the scenes using the stored `ObjectId`s and
substitutes the full documents in place of the bare IDs.

### Why do these relationships matter?

- They let the system answer questions that span entities without duplicating
  data — e.g. "show me this job *and* who it's assigned to *and* who
  requested it" comes back as one coherent object, fetched from three
  collections joined by reference.
- They keep each piece of information in exactly one place. A technician's
  name and phone number live only on their `User` document; every `Job` that
  references them automatically reflects the latest values (no stale copies
  to keep in sync).
- They make access-control checks possible — e.g. "is this technician allowed
  to update this job?" is answered by comparing `job.technician` to
  `context.user._id` ([jobResolvers.js:162](../backend/src/graphql/resolvers/jobResolvers.js#L162)).

### What happens in the database when a job is created?

Walking through `createJob` end to end
([jobResolvers.js:98-144](../backend/src/graphql/resolvers/jobResolvers.js#L98-L144)):

1. **Authorization check** — `authorizeRoles("ADMIN")(context.user)` ensures
   only an admin can reach this point.
2. **Reference validation** — the resolver looks up the technician and client
   `User` documents by the IDs supplied, and rejects the request if either
   doesn't exist or has the wrong role:

```javascript
// backend/src/graphql/resolvers/jobResolvers.js (lines 104–115)
const technician = await User.findById(technicianId);
if (!technician || technician.role !== "TECHNICIAN") {
  throw new Error("Invalid technician");
}

const client = await User.findById(clientId);
if (!client || client.role !== "CLIENT") {
  throw new Error("Invalid client");
}
```

3. **Insert** — a new `Job` document is written to MongoDB with `Job.create`,
   storing the technician/client/creator as `ObjectId` references and
   defaulting `status` to `PENDING` and `priority` to `MEDIUM` if not
   supplied:

```javascript
// backend/src/graphql/resolvers/jobResolvers.js (lines 118–126)
const job = await Job.create({
  title,
  description,
  location,
  priority: priority ?? "MEDIUM",
  technician: technicianId,
  client: clientId,
  createdBy: context.user._id,
});
```

4. **Side effects (non-blocking)** — two emails fire (job-confirmation to the
   client via `sendJobCreatedEmail`, job-assignment to the technician via
   `sendJobAssignedEmail`), each wrapped in its own `try/catch` so that an
   email-delivery problem can never roll back or block the job that was just
   created:

```javascript
// backend/src/graphql/resolvers/jobResolvers.js (lines 128–138)
try {
  await sendJobCreatedEmail({ client, job, technician });
} catch (err) {
  console.error("Failed to send job confirmation email:", err.message);
}

try {
  await sendJobAssignedEmail({ technician, job, client });
} catch (err) {
  console.error("Failed to send job assignment email:", err.message);
}
```

5. **Response** — the freshly created job is re-fetched *with its references
   resolved* (`.populate(...)`) and returned to the frontend as JSON.

A very similar flow happens on `updateJobStatus`
([jobResolvers.js:146-210](../backend/src/graphql/resolvers/jobResolvers.js#L146-L210)):
the new status is validated against the allowed lifecycle, the job is saved,
an in-app `Notification` document is created, and a `sendJobStatusUpdateEmail`
is sent to the client — again wrapped in `try/catch` so email problems can't
break the status update.

### How does the system avoid duplicate records and keep data consistent?

Several layers of integrity checks, enforced at different levels:

1. **Unique index on email** — `email: { ..., unique: true }` on the `User`
   schema ([User.js:11-16](../backend/src/models/User.js#L11-L16)) makes
   MongoDB reject any attempt to insert a second user with the same email at
   the database level. The application also checks proactively before
   inserting, so it can return a friendly error rather than a raw database
   exception:

```javascript
// backend/src/graphql/resolvers/userResolvers.js (lines 54–59)
const existingUser = await User.findOne({ email });

if (existingUser) {
  throw new Error("User already exists");
}
```

2. **Schema-level validation** — `required: true`, `enum: [...]`, and
   `default: ...` on every model field mean MongoDB/Mongoose will refuse to
   save documents that don't match the expected shape. For example, `Job`
   can only ever have a `status` that is one of `PENDING | IN_PROGRESS |
   COMPLETED | VERIFIED | CANCELLED`
   ([Job.js:20-30](../backend/src/models/Job.js#L20-L30)) — there is no way
   to save an invalid status string.

3. **Application-level lifecycle validation** — beyond what the schema can
   express, `jobResolvers.js` defines exactly which status transitions are
   legal, preventing nonsensical jumps (e.g. `PENDING` straight to
   `VERIFIED`):

```javascript
// backend/src/graphql/resolvers/jobResolvers.js (lines 11–19)
const allowedTransitions = {
  PENDING: ["IN_PROGRESS"],
  IN_PROGRESS: ["COMPLETED"],
  COMPLETED: ["VERIFIED"],
  VERIFIED: [],
};
```

   This is checked before any save:

```javascript
// backend/src/graphql/resolvers/jobResolvers.js (lines 178–182)
if (!validateStatusTransition(job.status, status)) {
  throw new Error(
    `Invalid status transition from ${job.status} to ${status}`,
  );
}
```

4. **Referential checks before linking records** — as shown above, `createJob`
   verifies that the `technicianId`/`clientId` actually point at existing
   `User` documents *with the correct role* before creating the link,
   preventing "orphan" references to non-existent or wrong-type users.

5. **`timestamps: true`** on every schema automatically and consistently
   stamps `createdAt`/`updatedAt` on every document, so ordering and auditing
   ("when was this job created/last touched?") is always reliable without any
   manual bookkeeping.

### "What you should know" — quick definitions

- **Why MongoDB/NoSQL** — a document database stores data as JSON-like
  documents rather than rows in rigid tables, which maps naturally onto a
  JSON-speaking GraphQL API and tolerates an evolving schema during active
  development.
- **Collections** — MongoDB's equivalent of SQL "tables": `User`, `Job`,
  `Notification`.
- **Primary key** — the document's unique `_id` (`ObjectId`), generated
  automatically.
- **Foreign key (NoSQL style)** — an `ObjectId` field with a `ref` pointing
  at another collection (e.g. `Job.client → User._id`); resolved into a full
  document via `.populate()`.
- **Relationships** — modeled by storing references rather than duplicating
  data: one `Client` → many `Job`s, one `Technician` → many `Job`s, one
  `Job`/`Client` → many `Notification`s.
- **Data integrity** — enforced through a unique index (`email`), schema
  validation (`required`, `enum`, `default`), and explicit application-level
  rules (status-transition map, role checks on references).

---

### Quick reference — file map

| File | What it's responsible for |
|---|---|
| [backend/src/server.js](../backend/src/server.js) | Boots Express + Apollo Server, mounts `/graphql`, wires up the auth context |
| [backend/src/app.js](../backend/src/app.js) | Base Express app: CORS + JSON body parsing |
| [backend/src/middleware/authMiddleware.js](../backend/src/middleware/authMiddleware.js) | Decodes the JWT from the `Authorization` header into `context.user` |
| [backend/src/middleware/roleMiddleware.js](../backend/src/middleware/roleMiddleware.js) | `authorizeRoles(...roles)` — throws if the caller's role isn't allowed |
| [backend/src/utils/generateToken.js](../backend/src/utils/generateToken.js) | Signs a JWT containing `{ id, role }`, valid for 7 days |
| [backend/src/graphql/resolvers/userResolvers.js](../backend/src/graphql/resolvers/userResolvers.js) | `register`, `createTechnician`, `changePassword`, `login` — all auth/account logic |
| [backend/src/graphql/resolvers/jobResolvers.js](../backend/src/graphql/resolvers/jobResolvers.js) | `createJob`, `updateJobStatus`, `cancelJob`, `reassignJob`, etc. — all job logic + email triggers |
| [backend/src/services/emailService.js](../backend/src/services/emailService.js) | Builds and sends the three transactional emails (job-confirmation, job-assignment, status-update) |
| [backend/src/models/User.js](../backend/src/models/User.js) | `User` schema (admins, technicians, and clients in one collection, distinguished by `role`) |
| [backend/src/models/Job.js](../backend/src/models/Job.js) | `Job` schema (status/priority enums, references to technician/client/createdBy) |
| [backend/src/models/Notification.js](../backend/src/models/Notification.js) | `Notification` schema (in-app status messages, references to client + job) |
| [frontendui/src/services/apolloClient.js](../frontendui/src/services/apolloClient.js) | Apollo Client setup; attaches the JWT to every outgoing request |
| [frontendui/src/shared/context/AuthContext.jsx](../frontendui/src/shared/context/AuthContext.jsx) | Frontend `login`/`logout`/`changePassword`, persists user + token to `localStorage` |
| [frontendui/src/components/forms/LoginForm.jsx](../frontendui/src/components/forms/LoginForm.jsx) | The login screen UI and post-login role-based redirect |
