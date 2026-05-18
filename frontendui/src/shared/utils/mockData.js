// src/shared/utils/mockData.js
// Central mock data store — replace individual arrays with API calls later.
// Every hook (useAdminData, useTechnicianData) imports from here.

export const MOCK_USERS = [
  {
    id: "user-1",
    name: "Akosua Mensah",
    email: "akosua@swiftfix.com",
    role: "ADMIN",
    initials: "AM",
    phone: "+233 30 291 0000",
    isActive: true,
  },
  {
    id: "user-2",
    name: "Kwame Asante",
    email: "kwame@swiftfix.com",
    role: "TECHNICIAN",
    initials: "KA",
    phone: "+233 24 456 7890",
    isActive: true,
    activeJobs: 2,
    completedThisMonth: 18,
    avgDurationHours: 2.8,
    online: true,
  },
  {
    id: "user-3",
    name: "Ama Boateng",
    email: "ama@swiftfix.com",
    role: "TECHNICIAN",
    initials: "AB",
    phone: "+233 20 123 4567",
    isActive: true,
    activeJobs: 1,
    completedThisMonth: 12,
    avgDurationHours: 3.4,
    online: true,
  },
  {
    id: "user-4",
    name: "Emmanuel Owusu",
    email: "emmanuel@swiftfix.com",
    role: "TECHNICIAN",
    initials: "EO",
    phone: "+233 55 987 6543",
    isActive: true,
    activeJobs: 0,
    completedThisMonth: 22,
    avgDurationHours: 3.8,
    online: true,
  },
  {
    id: "user-5",
    name: "Selorm Agyei",
    email: "selorm@swiftfix.com",
    role: "TECHNICIAN",
    initials: "SA",
    phone: "+233 26 333 2211",
    isActive: true,
    activeJobs: 3,
    completedThisMonth: 9,
    avgDurationHours: 5.4,
    online: false,
  },
  // CLIENT users — exist for job assignment but have no UI
  {
    id: "client-1",
    name: "Accra Business Centre",
    email: "facilities@accrabiz.com",
    role: "CLIENT",
    contactName: "Ms. Abena Sarfo",
    phone: "+233 30 291 5555",
  },
  {
    id: "client-2",
    name: "Regal Estates Ltd.",
    email: "maintenance@regalestates.com",
    role: "CLIENT",
    contactName: "Mr. Kojo Asare",
    phone: "+233 24 567 8901",
  },
  {
    id: "client-3",
    name: "Tema Hub Ltd.",
    email: "ops@temahub.com",
    role: "CLIENT",
    contactName: "Mrs. Efua Mensah",
    phone: "+233 20 444 5566",
  },
];

export const MOCK_JOBS = [
  {
    id: "job-1",
    jobNumber: "#JOB-0041",
    title: "AC Unit Service – 3rd Floor",
    description:
      "Service and regas the central AC unit on the 3rd floor of Building A. Check filters and coolant levels.",
    location: "North Industrial Park, Gate 3, Accra",
    clientId: "client-1",
    technicianId: "user-2",
    status: "IN_PROGRESS",
    priority: "HIGH",
    statusHistory: [
      {
        status: "IN_PROGRESS",
        changedById: "user-2",
        changedByName: "Kwame Asante",
        changedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        note: null,
      },
      {
        status: "PENDING",
        changedById: "user-1",
        changedByName: "Akosua Mensah",
        changedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        note: null,
      },
    ],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "job-2",
    jobNumber: "#JOB-0040",
    title: "Plumbing – Block B Toilets",
    description:
      "Inspect and fix blocked drainage in the Block B ground floor toilets. Check both male and female facilities.",
    location: "Regal Apartments, Block B, Tema, Accra",
    clientId: "client-2",
    technicianId: "user-3",
    status: "PENDING",
    priority: "MEDIUM",
    statusHistory: [
      {
        status: "PENDING",
        changedById: "user-1",
        changedByName: "Akosua Mensah",
        changedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        note: null,
      },
    ],
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "job-3",
    jobNumber: "#JOB-0039",
    title: "Generator Inspection",
    description:
      "Routine inspection of the backup generator in the basement plant room. Check oil, fuel and run test.",
    location: "Tema Industrial Hub, Tema",
    clientId: "client-3",
    technicianId: "user-4",
    status: "COMPLETED",
    priority: "LOW",
    completionNote:
      "Generator serviced. Oil changed, filters cleaned. All systems running normally.",
    statusHistory: [
      {
        status: "COMPLETED",
        changedById: "user-4",
        changedByName: "Emmanuel Owusu",
        changedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        note: "Generator serviced. Oil changed, filters cleaned.",
      },
      {
        status: "IN_PROGRESS",
        changedById: "user-4",
        changedByName: "Emmanuel Owusu",
        changedAt: new Date(Date.now() - 27 * 60 * 60 * 1000).toISOString(),
        note: null,
      },
      {
        status: "PENDING",
        changedById: "user-1",
        changedByName: "Akosua Mensah",
        changedAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
        note: null,
      },
    ],
    createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "job-4",
    jobNumber: "#JOB-0038",
    title: "Electrical Panel Check",
    description:
      "Check main electrical panel for any signs of wear, loose connections, or overheating.",
    location: "Airport Residential, East Legon",
    clientId: "client-1",
    technicianId: "user-2",
    status: "VERIFIED",
    priority: "MEDIUM",
    completionNote: "Panel checked and cleaned. All connections secure.",
    statusHistory: [
      {
        status: "VERIFIED",
        changedById: "user-1",
        changedByName: "Akosua Mensah",
        changedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        note: "Confirmed on site visit.",
      },
      {
        status: "COMPLETED",
        changedById: "user-2",
        changedByName: "Kwame Asante",
        changedAt: new Date(Date.now() - 50 * 60 * 60 * 1000).toISOString(),
        note: null,
      },
      {
        status: "IN_PROGRESS",
        changedById: "user-2",
        changedByName: "Kwame Asante",
        changedAt: new Date(Date.now() - 52 * 60 * 60 * 1000).toISOString(),
        note: null,
      },
      {
        status: "PENDING",
        changedById: "user-1",
        changedByName: "Akosua Mensah",
        changedAt: new Date(Date.now() - 54 * 60 * 60 * 1000).toISOString(),
        note: null,
      },
    ],
    createdAt: new Date(Date.now() - 54 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "job-5",
    jobNumber: "#JOB-0037",
    title: "Lift Maintenance – Tower 2",
    description:
      "Scheduled maintenance on the lift in Tower 2. Check cables, doors, and emergency systems.",
    location: "Cantonments Office Park, Accra",
    clientId: "client-2",
    technicianId: "user-5",
    status: "PENDING",
    priority: "HIGH",
    statusHistory: [
      {
        status: "PENDING",
        changedById: "user-1",
        changedByName: "Akosua Mensah",
        changedAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
        note: null,
      },
    ],
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
  },
];

export const MOCK_NOTIFICATIONS = [
  {
    id: "notif-1",
    type: "STATUS_CHANGED",
    message: "#JOB-0039 marked Completed by Emmanuel O.",
    jobId: "job-3",
    isRead: false,
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-2",
    type: "STATUS_CHANGED",
    message: "#JOB-0041 started by Kwame A.",
    jobId: "job-1",
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-3",
    type: "JOB_VERIFIED",
    message: "#JOB-0038 verified and closed.",
    jobId: "job-4",
    isRead: true,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
];

// Helper: look up user by ID
export function getUserById(id) {
  return MOCK_USERS.find((u) => u.id === id) ?? null;
}

// Helper: look up job by ID
export function getJobById(id) {
  return MOCK_JOBS.find((j) => j.id === id) ?? null;
}

// Helper: get all technicians
export function getTechnicians() {
  return MOCK_USERS.filter((u) => u.role === "TECHNICIAN" && u.isActive);
}

// Helper: get all clients
export function getClients() {
  return MOCK_USERS.filter((u) => u.role === "CLIENT");
}

// Helper: get jobs for a specific technician
export function getJobsByTechnician(technicianId) {
  return MOCK_JOBS.filter((j) => j.technicianId === technicianId);
}
