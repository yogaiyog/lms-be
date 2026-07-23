"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentTopicProgressUpdateSchema = exports.studentTopicProgressUpsertSchema = void 0;
const zod_1 = require("zod");
// metadata bisa string (JSON string) atau object (akan distorage sebagai JSON string).
const metadataField = zod_1.z
    .union([zod_1.z.string(), zod_1.z.record(zod_1.z.unknown())])
    .optional()
    .nullable();
exports.studentTopicProgressUpsertSchema = zod_1.z.object({
    studentId: zod_1.z.string().min(1),
    // Either topicTaskId (UUID) or code (e.g. "m1") resolved via lookup.
    topicTaskId: zod_1.z.string().uuid().optional(),
    topicTaskCode: zod_1.z.string().min(1).optional(),
    status: zod_1.z.enum(["available", "in_progress", "completed"]),
    metadata: metadataField,
}).refine((value) => value.topicTaskId || value.topicTaskCode, "Either topicTaskId or topicTaskCode is required");
exports.studentTopicProgressUpdateSchema = zod_1.z.object({
    status: zod_1.z.enum(["available", "in_progress", "completed"]).optional(),
    metadata: metadataField,
});
