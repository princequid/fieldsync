const nodemailer = require("nodemailer");

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  return transporter;
};

const sendMail = async ({ to, subject, text, html }) => {
  const mailer = getTransporter();

  if (!mailer) {
    console.warn(`Email not sent (SMTP not configured): "${subject}" to ${to}`);
    return;
  }

  await mailer.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  });
};

const PRIORITY_LABELS = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

const STATUS_LABELS = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  VERIFIED: "Verified",
  CANCELLED: "Cancelled",
};

const STATUS_NOTES = {
  PENDING: "The job is waiting for the assigned technician to begin work.",
  IN_PROGRESS: "Your technician has arrived on-site and is now working on the job.",
  COMPLETED: "Your technician has finished the work. Our admin team will verify it shortly.",
  VERIFIED: "The completed work has been reviewed and verified by our admin team. This job is now closed.",
  CANCELLED: "This job has been cancelled. Contact your administrator if you have questions.",
};

const formatJobDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const detailRow = (label, value) =>
  `<tr>
     <td style="padding:8px 0;font-size:13px;color:#6b7280;width:140px;vertical-align:top;">${label}</td>
     <td style="padding:8px 0;font-size:14px;color:#111827;font-weight:500;">${value}</td>
   </tr>`;

const detailTable = (rows) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e5e7eb;border-bottom:1px solid #e5e7eb;margin-bottom:20px;">
     ${rows.join("")}
   </table>`;

// Shared HTML layout — branded header, content slot, muted footer.
const renderLayout = ({ heading, intro, body, footerNote }) => `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;">
            <tr>
              <td style="background-color:#1e3a5f;padding:20px 28px;">
                <span style="font-size:16px;font-weight:600;color:#ffffff;letter-spacing:-0.2px;">FieldSync</span>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <h1 style="margin:0 0 12px;font-size:18px;font-weight:600;color:#111827;">${heading}</h1>
                <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#374151;">${intro}</p>
                ${body}
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px;background-color:#f9fafb;border-top:1px solid #e5e7eb;">
                <p style="margin:0;font-size:12px;color:#9ca3af;">${footerNote}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

const FOOTER_NOTE =
  "This is an automated message from FieldSync. If you weren't expecting this email, please contact your administrator.";

// ─── Sent to the client when their job is created ──────────────────────────

const sendJobCreatedEmail = async ({ client, job, technician }) => {
  const subject = `Job Confirmation — ${job.title}`;
  const priorityLabel = PRIORITY_LABELS[job.priority] || job.priority || "Medium";
  const statusLabel = STATUS_LABELS[job.status] || job.status || "Pending";
  const createdDate = formatJobDate(job.createdAt || Date.now());

  const text =
    `Hi ${client.name},\n\n` +
    `This confirms that a new job has been created for you with FieldSync.\n\n` +
    `Job: ${job.title}\n` +
    `Description: ${job.description}\n` +
    `Location: ${job.location}\n` +
    `Priority: ${priorityLabel}\n` +
    `Status: ${statusLabel}\n` +
    `Assigned technician: ${technician.name}${technician.phone ? ` (${technician.phone})` : ""}\n` +
    `Date created: ${createdDate}\n\n` +
    `Your technician will be in touch, and we'll keep you updated as the job progresses.\n\n` +
    `Thank you for choosing FieldSync.\n\n` +
    `— The FieldSync Team`;

  const html = renderLayout({
    heading: "Your job has been created",
    intro: `Hi ${client.name}, this confirms that a new job has been scheduled for you with FieldSync. Details are below.`,
    body:
      detailTable([
        detailRow("Job", job.title),
        detailRow("Description", job.description),
        detailRow("Location", job.location),
        detailRow("Priority", priorityLabel),
        detailRow("Status", statusLabel),
        detailRow("Technician", `${technician.name}${technician.phone ? ` &middot; ${technician.phone}` : ""}`),
        detailRow("Date created", createdDate),
      ]) +
      `<p style="margin:0;font-size:14px;line-height:1.6;color:#374151;">
         Your assigned technician will be in touch ahead of the visit, and we'll keep you updated as the job progresses.
       </p>`,
    footerNote: FOOTER_NOTE,
  });

  await sendMail({ to: client.email, subject, text, html });
};

// ─── Sent to the technician when a job is assigned to them ─────────────────

const sendJobAssignedEmail = async ({ technician, job, client }) => {
  const subject = `New Job Assigned — ${job.title}`;
  const priorityLabel = PRIORITY_LABELS[job.priority] || job.priority || "Medium";
  const createdDate = formatJobDate(job.createdAt || Date.now());

  const text =
    `Hi ${technician.name},\n\n` +
    `A new job has been assigned to you on FieldSync. Please log in to review the details and get started.\n\n` +
    `Job: ${job.title}\n` +
    `Description: ${job.description}\n` +
    `Location: ${job.location}\n` +
    `Priority: ${priorityLabel}\n` +
    `Client: ${client.name}\n` +
    `Date assigned: ${createdDate}\n\n` +
    `Log in to FieldSync to view the full job details and update its status once you begin work.\n\n` +
    `— The FieldSync Team`;

  const html = renderLayout({
    heading: "A new job has been assigned to you",
    intro: `Hi ${technician.name}, you've been assigned a new job on FieldSync. Please log in and get to work — details are below.`,
    body:
      detailTable([
        detailRow("Job", job.title),
        detailRow("Description", job.description),
        detailRow("Location", job.location),
        detailRow("Priority", priorityLabel),
        detailRow("Client", client.name),
        detailRow("Date assigned", createdDate),
      ]) +
      `<p style="margin:0;font-size:14px;line-height:1.6;color:#374151;">
         Please log in to FieldSync to review the full job details, head to the site, and update the job status as you make progress.
       </p>`,
    footerNote: FOOTER_NOTE,
  });

  await sendMail({ to: technician.email, subject, text, html });
};

// ─── Sent to the client when their job's status changes ────────────────────

const sendJobStatusUpdateEmail = async ({ client, job, technician, status }) => {
  const statusLabel = STATUS_LABELS[status] || status;
  const note = STATUS_NOTES[status] || "There has been an update to your job.";
  const subject = `Job Update — ${job.title} is now ${statusLabel}`;
  const updatedDate = formatJobDate(Date.now());

  const text =
    `Hi ${client.name},\n\n` +
    `There's an update on your job with FieldSync.\n\n` +
    `Job: ${job.title}\n` +
    `New status: ${statusLabel}\n` +
    `Location: ${job.location}\n` +
    `Technician: ${technician?.name ?? "—"}\n` +
    `Updated: ${updatedDate}\n\n` +
    `${note}\n\n` +
    `— The FieldSync Team`;

  const html = renderLayout({
    heading: "Your job status has been updated",
    intro: `Hi ${client.name}, here's the latest update on your job with FieldSync.`,
    body:
      detailTable([
        detailRow("Job", job.title),
        detailRow(
          "New status",
          `<span style="display:inline-block;padding:2px 10px;border-radius:4px;background-color:#eff6ff;color:#1d4ed8;font-size:12px;font-weight:600;">${statusLabel}</span>`,
        ),
        detailRow("Location", job.location),
        detailRow("Technician", technician?.name ?? "—"),
        detailRow("Updated", updatedDate),
      ]) +
      `<p style="margin:0;font-size:14px;line-height:1.6;color:#374151;">${note}</p>`,
    footerNote: FOOTER_NOTE,
  });

  await sendMail({ to: client.email, subject, text, html });
};

module.exports = {
  sendJobCreatedEmail,
  sendJobAssignedEmail,
  sendJobStatusUpdateEmail,
};
