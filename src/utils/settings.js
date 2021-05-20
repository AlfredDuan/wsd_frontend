export const accountFields = [
  { title: "Username", field: "username" },
  { title: "Email", field: "email" },
  {
    title: "Role",
    field: "role",
    lookup: { user: "User", premiumuser: "Premium User", admin: "Admin" },
  },
];

export const eventTypeFields = [
  { title: "Event Tag", field: "eventTag" },
  { title: "Description", field: "description" },
];

export const additionalTypeFields = [
  { title: "Operation", field: "operation" },
  { title: "Description", field: "description" },
];
