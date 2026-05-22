# Form System & Badge System - Complete Rebuild

## Overview

This document outlines the complete rebuild of the input/form system and badge system with pixel-perfect specifications and perfect consistency across the application.

## Directory Structure

```
src/shared/components/
├── forms/                    # Form input components
│   ├── FormInput.jsx        # Text input field (40px height, all styling specs)
│   ├── FormSelect.jsx       # Custom styled select with ChevronDown icon
│   ├── FormTextarea.jsx     # Textarea (100px min-height, resize-y only)
│   ├── FormGroup.jsx        # Container with 16px spacing
│   ├── FormSectionHeading.jsx # Section heading with divider (13px, #374151)
│   ├── FormFooter.jsx       # Sticky footer for forms (68px tall)
│   └── index.js             # Barrel export
│
├── badge/                    # Badge components
│   ├── BadgeStyles.js       # Centralized badge configuration
│   ├── StatusBadge.jsx      # Status badge (PENDING, IN_PROGRESS, COMPLETED, VERIFIED)
│   ├── PriorityBadge.jsx    # Priority badge (HIGH, MEDIUM, LOW)
│   └── index.js             # Barrel export
│
└── (backward compatibility)
    ├── StatusBadge.jsx      # Re-exports from badge/StatusBadge.jsx
    ├── PriorityBadge.jsx    # Re-exports from badge/PriorityBadge.jsx
    └── Input.jsx            # Re-exports from forms/FormInput.jsx
```

---

## Form System

### FormInput Component

**Text input field with complete styling specification.**

#### Specifications

- **Height:** 40px
- **Border radius:** 8px
- **Font:** 13px
- **Text color:** #0F172A
- **Background at rest:** #F8FAFC
- **Border at rest:** 1px #E2E8F0
- **Focus state (150ms transition):**
  - Background: white
  - Border: #2E86AB
  - Focus ring: 0 0 0 3px rgba(46,134,171,0.15)
- **Error state:**
  - Border: #EF4444
  - Background: #FEF2F2
  - Message: 11px #EF4444 with alert circle icon
- **Label:** 6px above input, 12px font-medium #374151
- **Required indicator:** Asterisk in #EF4444
- **Helper text:** 11px #94A3B8 below input

#### Usage

```jsx
import { FormInput } from "@/shared/components/forms";

export default function MyForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  return (
    <FormInput
      id="email-input"
      label="Email Address"
      type="email"
      placeholder="you@example.com"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      error={error}
      helperText="We'll never share your email."
      required
    />
  );
}
```

#### Props

| Prop           | Type     | Default             | Description                        |
| -------------- | -------- | ------------------- | ---------------------------------- |
| `id`           | string   | label in kebab-case | Input element ID                   |
| `label`        | string   | undefined           | Label text                         |
| `type`         | string   | "text"              | HTML input type                    |
| `placeholder`  | string   | undefined           | Placeholder text                   |
| `value`        | string   | undefined           | Input value                        |
| `onChange`     | function | undefined           | Change handler                     |
| `onBlur`       | function | undefined           | Blur handler                       |
| `error`        | string   | undefined           | Error message (shows error state)  |
| `helperText`   | string   | undefined           | Helper text below input            |
| `required`     | boolean  | false               | Shows asterisk for required fields |
| `disabled`     | boolean  | false               | Disabled state                     |
| `autoComplete` | string   | undefined           | HTML autocomplete attribute        |
| `className`    | string   | ""                  | Additional CSS classes             |

---

### FormSelect Component

**Custom styled select input with ChevronDown icon.**

#### Specifications

- Uses custom styled container that looks identical to FormInput
- ChevronDown icon from Lucide positioned absolutely at right
- Icon color: #94A3B8 at rest, #2E86AB when focused
- Native select element is invisible
- Custom container sits on top using pointer-events tricks
- Same height (40px) and styling as FormInput

#### Usage

```jsx
import { FormSelect } from "@/shared/components/forms";

export default function JobForm() {
  const [priority, setPriority] = useState("");

  return (
    <FormSelect
      id="priority-select"
      label="Priority Level"
      options={[
        { value: "LOW", label: "Low" },
        { value: "MEDIUM", label: "Medium" },
        { value: "HIGH", label: "High" },
      ]}
      value={priority}
      onChange={(e) => setPriority(e.target.value)}
      required
    />
  );
}
```

#### Props

| Prop          | Type     | Default             | Description                       |
| ------------- | -------- | ------------------- | --------------------------------- |
| `id`          | string   | label in kebab-case | Select element ID                 |
| `label`       | string   | undefined           | Label text                        |
| `options`     | array    | []                  | Array of { value, label } objects |
| `value`       | string   | undefined           | Selected value                    |
| `onChange`    | function | undefined           | Change handler                    |
| `onBlur`      | function | undefined           | Blur handler                      |
| `error`       | string   | undefined           | Error message                     |
| `helperText`  | string   | undefined           | Helper text                       |
| `required`    | boolean  | false               | Shows asterisk                    |
| `disabled`    | boolean  | false               | Disabled state                    |
| `placeholder` | string   | "Select..."         | Placeholder text                  |
| `className`   | string   | ""                  | Additional CSS classes            |

---

### FormTextarea Component

**Textarea input with same styling as FormInput.**

#### Specifications

- Same styling as FormInput
- Minimum height: 100px
- Resize: y-axis only
- Shows character count if `maxLength` is provided

#### Usage

```jsx
import { FormTextarea } from "@/shared/components/forms";

export default function ReportForm() {
  const [notes, setNotes] = useState("");

  return (
    <FormTextarea
      id="notes"
      label="Additional Notes"
      placeholder="Enter any additional details..."
      value={notes}
      onChange={(e) => setNotes(e.target.value)}
      maxLength={500}
      rows={4}
    />
  );
}
```

#### Props

| Prop          | Type     | Default             | Description                    |
| ------------- | -------- | ------------------- | ------------------------------ |
| `id`          | string   | label in kebab-case | Textarea element ID            |
| `label`       | string   | undefined           | Label text                     |
| `placeholder` | string   | undefined           | Placeholder text               |
| `value`       | string   | undefined           | Textarea value                 |
| `onChange`    | function | undefined           | Change handler                 |
| `onBlur`      | function | undefined           | Blur handler                   |
| `error`       | string   | undefined           | Error message                  |
| `helperText`  | string   | undefined           | Helper text                    |
| `required`    | boolean  | false               | Shows asterisk                 |
| `disabled`    | boolean  | false               | Disabled state                 |
| `rows`        | number   | 4                   | Initial row count              |
| `maxLength`   | number   | undefined           | Max characters (shows counter) |
| `className`   | string   | ""                  | Additional CSS classes         |

---

### FormGroup Component

**Container for form fields with consistent 16px vertical spacing.**

#### Usage

```jsx
import { FormGroup, FormInput, FormSelect } from "@/shared/components/forms";

export default function Form() {
  return (
    <FormGroup>
      <FormInput label="Name" />
      <FormInput label="Email" type="email" />
      <FormSelect label="Category" options={[...]} />
    </FormGroup>
  );
}
```

---

### FormSectionHeading Component

**Section heading within forms with divider line.**

#### Specifications

- Font: 13px font-semibold #374151
- Divider: 1px #F1F5F9 below
- Top margin: 24px, bottom margin: 16px

#### Usage

```jsx
import {
  FormSectionHeading,
  FormInput,
  FormGroup,
} from "@/shared/components/forms";

export default function Form() {
  return (
    <>
      <FormSectionHeading>Personal Information</FormSectionHeading>
      <FormGroup>
        <FormInput label="First Name" />
        <FormInput label="Last Name" />
      </FormGroup>

      <FormSectionHeading>Contact Details</FormSectionHeading>
      <FormGroup>
        <FormInput label="Email" type="email" />
        <FormInput label="Phone" type="tel" />
      </FormGroup>
    </>
  );
}
```

---

### FormFooter Component

**Sticky footer bar for forms (like New Job page).**

#### Specifications

- Height: 68px
- Background: white
- Top border: 1px #F1F5F9
- Shadow: 0 -4px 12px rgba(0,0,0,0.04)
- Fixed to bottom of page
- Cancel button on left, Submit button on right

#### Usage

```jsx
import { FormFooter } from "@/shared/components/forms";

export default function NewJobPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Submit logic
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Form content here */}

      <FormFooter
        onCancel={() => navigate(-1)}
        onSubmit={handleSubmit}
        cancelText="Cancel"
        submitText="Create Job"
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
```

#### Props

| Prop           | Type     | Default   | Description            |
| -------------- | -------- | --------- | ---------------------- |
| `onCancel`     | function | undefined | Cancel button handler  |
| `onSubmit`     | function | undefined | Submit button handler  |
| `cancelText`   | string   | "Cancel"  | Cancel button text     |
| `submitText`   | string   | "Submit"  | Submit button text     |
| `isSubmitting` | boolean  | false     | Loading state          |
| `disabled`     | boolean  | false     | Disable all buttons    |
| `className`    | string   | ""        | Additional CSS classes |

---

## Badge System

### Centralized Configuration (BadgeStyles.js)

All badge styles are defined in one file for perfect consistency across the app.

### Status Badge Component

**Displays job status with colored dot and label.**

#### Status Options

| Status      | Background | Text    | Dot     | Border  | Pulse |
| ----------- | ---------- | ------- | ------- | ------- | ----- |
| PENDING     | #FFFBEB    | #B45309 | #F59E0B | #FDE68A | No    |
| IN_PROGRESS | #EFF6FF    | #1D4ED8 | #3B82F6 | #BFDBFE | Yes   |
| COMPLETED   | #F0FDF4    | #15803D | #22C55E | #BBF7D0 | No    |
| VERIFIED    | #F8FAFC    | #334155 | #64748B | #E2E8F0 | No    |

#### Badge Specifications (All badges)

- Display: inline-flex items-center
- Border radius: 20px
- Vertical padding: 4px
- Horizontal padding: 10px
- Font size: 11px font-medium
- Dot: 6px with 4px right margin
- Minimum width: 90px (prevents column shift)
- Feature settings: tabular numerals enabled

#### Usage

```jsx
import { StatusBadge } from "@/shared/components/badge";
// OR for backward compatibility:
import { StatusBadge } from "@/shared/components";

export default function JobCard({ job }) {
  return (
    <div>
      <StatusBadge status={job.status} showDot={true} />
    </div>
  );
}
```

#### Props

| Prop      | Type    | Default   | Description                                             |
| --------- | ------- | --------- | ------------------------------------------------------- |
| `status`  | string  | "PENDING" | Status value: PENDING, IN_PROGRESS, COMPLETED, VERIFIED |
| `showDot` | boolean | true      | Show/hide the colored dot                               |

---

### Priority Badge Component

**Displays job priority with optional icon.**

#### Priority Options

| Priority | Background | Text    | Border  | Icon         |
| -------- | ---------- | ------- | ------- | ------------ |
| HIGH     | #FEF2F2    | #991B1B | #FECACA | Flame (10px) |
| MEDIUM   | #FFFBEB    | #92400E | #FDE68A | None         |
| LOW      | #F0FDF4    | #166534 | #BBF7D0 | None         |

#### Usage

```jsx
import { PriorityBadge } from "@/shared/components/badge";
// OR for backward compatibility:
import { PriorityBadge } from "@/shared/components";

export default function JobCard({ job }) {
  return (
    <div>
      <PriorityBadge priority={job.priority} />
    </div>
  );
}
```

#### Props

| Prop       | Type   | Default  | Description                       |
| ---------- | ------ | -------- | --------------------------------- |
| `priority` | string | "MEDIUM" | Priority value: HIGH, MEDIUM, LOW |

---

### Using Badge Styles Programmatically

For advanced use cases, you can access badge styles directly:

```jsx
import {
  STATUS_BADGE_STYLES,
  PRIORITY_BADGE_STYLES,
  getStatusBadgeStyle,
  getPriorityBadgeStyle,
  getStatusDotColor,
  shouldPulseStatus,
  getPriorityIcon,
} from "@/shared/components/badge";

export default function CustomBadgeExample() {
  const statusStyle = getStatusBadgeStyle("IN_PROGRESS");
  const shouldPulse = shouldPulseStatus("IN_PROGRESS");

  return <span style={statusStyle}>Status {shouldPulse && "is pulsing"}</span>;
}
```

---

## Migration Guide

### Updating Existing Code

If you have existing form inputs or badges, update them as follows:

#### Old Input Component

```jsx
<input
  type="text"
  placeholder="Enter name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  className="border rounded px-3 py-2"
/>
```

#### New FormInput Component

```jsx
<FormInput
  id="name-input"
  label="Full Name"
  placeholder="Enter name"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

#### Old Badge Component

```jsx
<span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1 text-[12px]">
  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
  In Progress
</span>
```

#### New Badge Component

```jsx
<StatusBadge status="IN_PROGRESS" showDot={true} />
```

---

## Backward Compatibility

The new form and badge components maintain backward compatibility:

- `StatusBadge.jsx` in `shared/components/` re-exports from `badge/StatusBadge.jsx`
- `PriorityBadge.jsx` in `shared/components/` re-exports from `badge/PriorityBadge.jsx`
- `Input.jsx` in `shared/components/` re-exports from `forms/FormInput.jsx`

Existing imports will continue to work without any changes.

---

## Best Practices

1. **Always use FormGroup for multiple inputs** to maintain consistent 16px spacing
2. **Use FormSectionHeading** to organize long forms into logical sections
3. **Always provide labels** for accessibility (use `required` for mandatory fields)
4. **Show helper text** to guide users (e.g., password requirements)
5. **Use error messages** to provide clear feedback
6. **Place FormFooter** at the bottom of forms with multiple sections
7. **Use StatusBadge with showDot={true}** for better visual hierarchy
8. **Use PriorityBadge** in tables and cards for quick priority scanning

---

## Colors Reference

### Form System Colors

- Text: #0F172A
- Background (rest): #F8FAFC
- Background (focus): white
- Border (rest): #E2E8F0
- Border (focus): #2E86AB
- Focus ring: rgba(46,134,171,0.15)
- Label: #374151
- Label (required asterisk): #EF4444
- Error: #EF4444
- Error background: #FEF2F2
- Helper text: #94A3B8

### Badge System Colors

See badge tables above for complete color mappings.
