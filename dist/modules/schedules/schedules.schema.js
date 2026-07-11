"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleUpdateSchema = exports.scheduleCreateSchema = void 0;
const enums_1 = require("../../types/enums");
const zod_1 = require("zod");
exports.scheduleCreateSchema = zod_1.z.object({
    classId: zod_1.z.string().uuid(),
    dayOfWeek: zod_1.z.nativeEnum(enums_1.DayOfWeek),
    startTime: zod_1.z.string().min(1),
    endTime: zod_1.z.string().min(1),
    meetLink: zod_1.z.string().url(),
    topic: zod_1.z.string().min(1).optional().nullable(),
    topicId: zod_1.z.string().uuid().optional().nullable(),
    date: zod_1.z.coerce.date(),
    isDone: zod_1.z.boolean().optional(),
});
exports.scheduleUpdateSchema = exports.scheduleCreateSchema.partial().refine((value) => Object.keys(value).length > 0, "At least one field must be provided");
