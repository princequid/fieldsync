const fs = require("fs");
const path = require("path");

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Paragraph builders -------------------------------------------------------

function run(text, { bold, italic, size, color } = {}) {
  const props = [];
  if (bold) props.push("<w:b/>");
  if (italic) props.push("<w:i/>");
  if (size) props.push(`<w:sz w:val="${size}"/><w:szCs w:val="${size}"/>`);
  if (color) props.push(`<w:color w:val="${color}"/>`);
  const rPr = props.length ? `<w:rPr>${props.join("")}</w:rPr>` : "";
  return `<w:r>${rPr}<w:t xml:space="preserve">${esc(text)}</w:t></w:r>`;
}

function para(runs, { spacingBefore = 0, spacingAfter = 120, indent } = {}) {
  const pPrParts = [`<w:spacing w:before="${spacingBefore}" w:after="${spacingAfter}"/>`];
  if (indent) pPrParts.push(`<w:ind w:left="${indent}"/>`);
  return `<w:p><w:pPr>${pPrParts.join("")}</w:pPr>${runs}</w:p>`;
}

function title(text) {
  return para(run(text, { bold: true, size: 44 }), { spacingBefore: 0, spacingAfter: 240 });
}

function h1(text) {
  return para(run(text, { bold: true, size: 32, color: "1A6FA8" }), { spacingBefore: 360, spacingAfter: 160 });
}

function h2(text) {
  return para(run(text, { bold: true, size: 26 }), { spacingBefore: 200, spacingAfter: 100 });
}

function body(text) {
  return para(run(text, { size: 22 }), { spacingAfter: 120 });
}

function bodyMixed(parts) {
  // parts: array of [text, opts]
  const runs = parts.map(([t, o]) => run(t, { size: 22, ...(o || {}) })).join("");
  return para(runs, { spacingAfter: 120 });
}

function bullet(text, opts = {}) {
  const runs = run("•  " + text, { size: 22, ...opts });
  return para(runs, { spacingAfter: 60, indent: 360 });
}

function bulletMixed(parts) {
  const runs = "<w:r><w:rPr><w:sz w:val=\"22\"/><w:szCs w:val=\"22\"/></w:rPr><w:t xml:space=\"preserve\">•  </w:t></w:r>" +
    parts.map(([t, o]) => run(t, { size: 22, ...(o || {}) })).join("");
  return para(runs, { spacingAfter: 60, indent: 360 });
}

function code(text) {
  return para(run(text, { size: 20, color: "1A6FA8" }), { spacingAfter: 100, indent: 360 });
}

function spacer() {
  return para("", { spacingAfter: 60 });
}

// Document content ----------------------------------------------------------

const paras = [];

paras.push(title("FieldSync — Frontend Architecture & Build Notes"));
paras.push(bodyMixed([
  ["Generated ", {}],
  ["2026-06-07", { bold: true }],
  [". Describes how the FieldSync React frontend (", {}],
  ["fieldsync/frontendui", { italic: true }],
  [") is structured and how it integrates with the GraphQL backend.", {}],
]));

paras.push(h1("1. Technology Stack"));
paras.push(bullet("React 18.3.1 — component-based UI library"));
paras.push(bullet("Vite 8.0.13 — dev server and production bundler (npm run dev / build / preview)"));
paras.push(bullet("Tailwind CSS 4.3.0 — utility-first styling, wired in via @tailwindcss/postcss, postcss and autoprefixer"));
paras.push(bullet("Apollo Client 4.1.9 + graphql 16.14.0 — GraphQL data layer (queries, mutations, normalized cache)"));
paras.push(bullet("react-router-dom 6.30.3 — client-side routing and route guards"));
paras.push(bullet("recharts 3.8.1 — charts on the admin Analytics page"));
paras.push(bullet("lucide-react — icon set used throughout the UI"));

paras.push(h1("2. Project Structure (src/)"));
paras.push(bulletMixed([["admin/", { bold: true }], [" — admin-role UI: pages, components (Table, Sidebar, Topbar, modals), layouts and the AdminDataProvider hook", {}]]));
paras.push(bulletMixed([["technician/", { bold: true }], [" — technician-role UI: pages (JobDetail, StartJob, Profile), components (JobCard), layouts and the TechnicianDataProvider hook", {}]]));
paras.push(bulletMixed([["shared/", { bold: true }], [" — cross-role code: AuthContext, ThemeContext, reusable components, badges, form controls, skeleton loaders, utils", {}]]));
paras.push(bulletMixed([["graphql/", { bold: true }], [" — operations.js: every GraphQL query, mutation and fragment used by the app, defined in one place", {}]]));
paras.push(bulletMixed([["services/", { bold: true }], [" — apolloClient.js: the configured Apollo Client instance (HTTP link, auth link, cache)", {}]]));
paras.push(bulletMixed([["routes/", { bold: true }], [" — AppRoutes, AdminRoutes, ProtectedRoute, lazyPages/lazyRoute for code-split, role-aware routing", {}]]));
paras.push(bulletMixed([["context/, components/, data/, hooks/, pages/, styles/, assets/", { bold: true }], [" — supporting and legacy folders (e.g. data/ historically held mock fixtures that have now been replaced by live GraphQL data)", {}]]));

paras.push(h1("3. Application Bootstrap (main.jsx)"));
paras.push(body("The app is rendered into #root with a fixed provider nesting order, each layer adding a capability the layers below it can consume:"));
paras.push(code("ApolloProvider → BrowserRouter → AuthProvider → ThemeProvider → App"));
paras.push(bulletMixed([["ApolloProvider", { bold: true }], [" (from @apollo/client/react) supplies the configured Apollo Client to every component via React context, enabling useQuery/useMutation anywhere in the tree.", {}]]));
paras.push(bulletMixed([["BrowserRouter", { bold: true }], [" enables client-side routing for the whole app.", {}]]));
paras.push(bulletMixed([["AuthProvider", { bold: true }], [" (shared/context/AuthContext.jsx) tracks the signed-in user, exposes login/logout, and needs Apollo (via useApolloClient) to clear the cache on logout — hence it sits inside ApolloProvider.", {}]]));
paras.push(bulletMixed([["ThemeProvider", { bold: true }], [" (shared/context/ThemeContext) provides light/dark mode state consumed by Tailwind's dark: variants across components.", {}]]));

paras.push(h1("4. Data Layer — Apollo Client Setup (services/apolloClient.js)"));
paras.push(body("The client is assembled from three pieces:"));
paras.push(bulletMixed([["httpLink", { bold: true }], [" — created with createHttpLink({ uri: \"/graphql\" }). In development, Vite's dev server proxy forwards /graphql requests to the Express/Apollo backend running on http://localhost:5000, so the frontend never needs to know the backend's real address.", {}]]));
paras.push(bulletMixed([["authLink", { bold: true }], [" — built with setContext from @apollo/client/link/context. On every request it reads the JWT from localStorage (key fieldsync_token) and injects an Authorization: Bearer <token> header.", {}]]));
paras.push(bulletMixed([["InMemoryCache", { bold: true }], [" — Apollo's normalized client-side cache; entities are cached by id so refetches and mutation results stay consistent across components.", {}]]));
paras.push(body("The link chain is authLink.concat(httpLink), so every outgoing request passes through the auth link first and then the HTTP link."));
paras.push(h2("A packaging quirk worth knowing"));
paras.push(body("Apollo Client v4 splits its package: the React hooks (useQuery, useMutation, useApolloClient, ApolloProvider) live in @apollo/client/react, while the framework-agnostic core (ApolloClient, InMemoryCache, createHttpLink, gql, setContext) is exported from @apollo/client (which resolves to @apollo/client/core). Importing hooks from the wrong entry point produces “MISSING_EXPORT” build errors — this project imports hooks from @apollo/client/react throughout."));

paras.push(h1("5. GraphQL Operations Layer (graphql/operations.js)"));
paras.push(body("Every query, mutation and fragment the app uses is declared once in this file and imported wherever it's needed, instead of being scattered across components:"));
paras.push(bullet("LOGIN_MUTATION, REGISTER_MUTATION, GET_ME"));
paras.push(bullet("GET_USERS (role-filterable), GET_NOTIFICATIONS, MARK_NOTIFICATION_READ, MARK_ALL_NOTIFICATIONS_READ"));
paras.push(bullet("JOB_FIELDS — a shared GraphQL fragment listing the Job fields every job-related operation needs"));
paras.push(bullet("GET_JOBS, GET_JOB_STATS, CREATE_JOB, UPDATE_JOB_STATUS, CANCEL_JOB, REASSIGN_JOB, REJECT_JOB_COMPLETION"));
paras.push(body("Reusing JOB_FIELDS across GET_JOBS, CREATE_JOB and the status/cancel/reassign mutations keeps the field selection consistent and means the normalized Apollo cache updates correctly after every mutation without manual cache-writing code."));

paras.push(h1("6. Authentication (shared/context/AuthContext.jsx)"));
paras.push(body("AuthProvider wraps the whole application and exposes { user, login, logout, activateFirstLogin, isAuthenticated } through the useAuth() hook. Key behaviours:"));
paras.push(bulletMixed([["login(email, password)", { bold: true }], [" posts a GraphQL login mutation directly with fetch(\"/graphql\", …) (bypassing Apollo so the token can be captured before Apollo Client is configured to send it), then stores the returned JWT as fieldsync_token and the user profile as fieldsync_user in localStorage.", {}]]));
paras.push(bulletMixed([["logout()", { bold: true }], [" removes both localStorage entries, clears React state, and calls apolloClient.clearStore() so cached data from the previous session can't leak into the next one.", {}]]));
paras.push(bulletMixed([["isAuthenticated", { bold: true }], [" and the stored user.role drive ProtectedRoute's redirects between the public, admin and technician parts of the app.", {}]]));

paras.push(h1("7. Role-Based Data Providers"));
paras.push(body("Two context providers sit between AuthContext and the page components, each wrapping Apollo's useQuery/useMutation hooks behind a small, purpose-built API:"));
paras.push(h2("AdminDataProvider — admin/hooks/useAdminData.jsx"));
paras.push(body("Runs four queries in parallel (GET_JOBS, GET_USERS for role TECHNICIAN, GET_USERS for role CLIENT, GET_NOTIFICATIONS) and wires up mutations for every admin action: createJob, verifyJob, rejectJob, cancelJob, reassignJob, createClient, addTechnician, markNotificationRead and markAllNotificationsRead. Each mutation declares refetchQueries so the relevant lists refresh automatically once it completes. createClient/addTechnician reuse the REGISTER_MUTATION with an auto-generated temporary password (e.g. `Client@${Date.now()}`)."));
paras.push(h2("TechnicianDataProvider — technician/hooks/useTechnicianData.jsx"));
paras.push(body("A leaner provider scoped to a single technician: a GET_JOBS query (skipped until a technicianId is known) plus an updateJobStatus mutation that drives the technician's job-progress workflow."));

paras.push(h1("8. Data Normalization Pattern"));
paras.push(body("The backend returns populated Mongoose documents (e.g. a Job's technician and client fields are full User objects with id/name/email/role), but the existing presentational components were built against flatter mock-data shapes (technicianId, clientId, companyName, initials, jobNumber, priority, online, statusHistory, …). Rather than rewrite every component, both data providers normalize the GraphQL response on the way in:"));
paras.push(bulletMixed([["normalizeUser", { bold: true }], [" — derives initials from the user's name, maps name → companyName, and fills in display-only placeholders (phone, address, online, activeJobs) the UI expects but the User model doesn't store.", {}]]));
paras.push(bulletMixed([["normalizeJob", { bold: true }], [" — flattens technician/client objects into *Id and *Email fields, derives a human-readable jobNumber from the Mongo _id, defaults priority to MEDIUM, and recursively normalizes the nested technician/client/createdBy users.", {}]]));
paras.push(bulletMixed([["normalizeNotification", { bold: true }], [" — flattens the related job to jobId and tags the notification with a display type.", {}]]));
paras.push(body("This adapter layer kept the visual/component code stable while swapping its data source from static mocks to live GraphQL — the components never need to know the data used to be mocked."));

paras.push(h1("9. Routing (routes/)"));
paras.push(bulletMixed([["index.jsx / AppRoutes.jsx", { bold: true }], [" — declare the top-level route tree (public/auth routes plus the admin and technician sub-trees).", {}]]));
paras.push(bulletMixed([["ProtectedRoute.jsx", { bold: true }], [" — a wrapper that checks isAuthenticated and the signed-in user's role before rendering a route, redirecting to /login or to the correct role's home otherwise.", {}]]));
paras.push(bulletMixed([["AdminRoutes.jsx", { bold: true }], [" — nests the admin pages (Dashboard, AllJobs, NewJob, JobDetail, TeamManagement, Analytics, …) inside the admin layout/shell.", {}]]));
paras.push(bulletMixed([["lazyPages.js / lazyRoute.jsx", { bold: true }], [" — wrap route-level page components in React.lazy + Suspense so each page is code-split into its own chunk and only downloaded when visited.", {}]]));

paras.push(h1("10. Styling & Theming"));
paras.push(bullet("Tailwind CSS 4 utility classes provide the bulk of the styling, processed through @tailwindcss/postcss with autoprefixer."));
paras.push(bullet("ThemeContext (shared/context/ThemeContext) holds the light/dark mode flag; components pair Tailwind utilities with dark: variants (e.g. bg-white dark:bg-gray-900) to support both themes."));
paras.push(bullet("Where the design calls for exact design-system colors, spacing or gradients that fall outside the Tailwind theme, components use inline style objects alongside Tailwind classes (visible throughout admin/technician pages such as Profile.jsx)."));

paras.push(h1("11. Component Organization"));
paras.push(bullet("admin/components & technician/components — role-specific presentational pieces: Table, Sidebar, AdminTopbar, JobCard, and modals such as ReassignModal and VerifyModal."));
paras.push(bullet("shared/components — cross-role building blocks: status badges (components/badge), form controls (components/forms), and loading skeletons (components/skeletons)."));
paras.push(bullet("pages — route-level screens (Dashboard, AllJobs, NewJob, JobDetail, TeamManagement, Analytics for admins; JobDetail, StartJob, Profile for technicians) that compose the above into full views and read from the data providers via useAdminData()/useTechnicianData()."));

paras.push(h1("12. Build & Dev Tooling"));
paras.push(bullet("Vite dev server (npm run dev) proxies /graphql to http://localhost:5000, so the React app and the GraphQL API can be developed against each other without CORS configuration."));
paras.push(bullet("npm run build produces the optimized production bundle (verified: “✓ built in 1.61s … 2902 modules transformed”, 0 errors); npm run preview serves that build locally."));

paras.push(h1("13. End-to-End Flow Summary"));
paras.push(body("Putting it together: a user logs in through AuthContext.login(), which stores a JWT; apolloClient's authLink attaches that JWT to every subsequent GraphQL request; AdminDataProvider or TechnicianDataProvider (chosen by the user's role via the route tree) fetches jobs/users/notifications with useQuery, normalizes them into the shapes the existing components expect, and exposes mutation functions that the pages call to create, update, cancel, reassign or verify jobs — each one automatically refreshing the relevant Apollo queries so the UI stays in sync with the MongoDB-backed Express/Apollo GraphQL backend."));

const body_xml = paras.join("");

const sectPr = '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1417" w:right="1417" w:bottom="1417" w:left="1417" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr>';

const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${body_xml}
    ${sectPr}
  </w:body>
</w:document>`;

fs.writeFileSync(path.join(__dirname, "word", "document.xml"), documentXml, "utf8");
console.log("document.xml written, length:", documentXml.length);
