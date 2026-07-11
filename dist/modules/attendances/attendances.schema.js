"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendanceUpdateSchema = exports.attendanceCreateSchema = void 0;
const enums_1 = require("../../types/enums");
const zod_1 = require("zod");
exports.attendanceCreateSchema = zod_1.z.object({
    scheduleId: zod_1.z.string().uuid(),
    studentId: zod_1.z.string().uuid(),
    date: zod_1.z.coerce.date(),
    status: zod_1.z.nativeEnum(enums_1.AttendanceStatus).optional(),
    notes: zod_1.z.string().min(1).optional().nullable(),
    teachedBy: zod_1.z.string().uuid().optional().nullable(),
});
exports.attendanceUpdateSchema = exports.attendanceCreateSchema.partial().refine((value) => Object.keys(value).length > 0, "At least one field must be provided");
