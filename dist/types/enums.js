"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceStatus = exports.ClassType = exports.DayOfWeek = exports.Category = exports.Role = void 0;
exports.Role = {
    ADMIN: "ADMIN",
    TUTOR: "TUTOR",
    PARENT: "PARENT",
    STUDENT: "STUDENT",
};
exports.Category = {
    JUNIOR_I: "JUNIOR_I",
    JUNIOR_II: "JUNIOR_II",
    JUNIOR_III: "JUNIOR_III",
};
exports.DayOfWeek = {
    MONDAY: "MONDAY",
    TUESDAY: "TUESDAY",
    WEDNESDAY: "WEDNESDAY",
    THURSDAY: "THURSDAY",
    FRIDAY: "FRIDAY",
    SATURDAY: "SATURDAY",
    SUNDAY: "SUNDAY",
};
exports.ClassType = {
    BATCH810: "BATCH810",
    BATCH35: "BATCH35",
    PRIVATE: "PRIVATE",
    MAKEUP: "MAKEUP",
    TRIAL: "TRIAL",
};
exports.AttendanceStatus = {
    PRESENT: "PRESENT",
    ABSENT: "ABSENT",
    LATE: "LATE",
    SICK: "SICK",
    PERMISSION: "PERMISSION",
    RESCHEDULE: "RESCHEDULE",
};
