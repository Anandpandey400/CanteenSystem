export const ROLES = {
  SUPER_ADMIN: "SuperAdmin",
  ADMIN: "Admin",
  SUPER_USER: "SuperUser",
  USER: "User",
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];
