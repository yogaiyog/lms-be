export const Role = {
  ADMIN: "ADMIN",
  TUTOR: "TUTOR",
  PARENT: "PARENT",
  STUDENT: "STUDENT",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const Category = {
  JUNIOR_I: "JUNIOR_I",
  JUNIOR_II: "JUNIOR_II",
  JUNIOR_III: "JUNIOR_III",
} as const;

export type Category = (typeof Category)[keyof typeof Category];

export const DayOfWeek = {
  MONDAY: "MONDAY",
  TUESDAY: "TUESDAY",
  WEDNESDAY: "WEDNESDAY",
  THURSDAY: "THURSDAY",
  FRIDAY: "FRIDAY",
  SATURDAY: "SATURDAY",
  SUNDAY: "SUNDAY",
} as const;

export type DayOfWeek = (typeof DayOfWeek)[keyof typeof DayOfWeek];

export const ClassType = {
  BATCH: "BATCH",
  PRIVATE: "PRIVATE",
  MAKEUP: "MAKEUP",
  OFFLINE: "OFFLINE",
} as const;

export type ClassType = (typeof ClassType)[keyof typeof ClassType];

export const AttendanceStatus = {
  PRESENT: "PRESENT",
  ABSENT: "ABSENT",
  LATE: "LATE",
  SICK: "SICK",
  PERMISSION: "PERMISSION",
} as const;

export type AttendanceStatus =
  (typeof AttendanceStatus)[keyof typeof AttendanceStatus];
