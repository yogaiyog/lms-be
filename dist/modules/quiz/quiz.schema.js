"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quizQuestionUpdateSchema = exports.quizQuestionCreateSchema = exports.quizQuestionChoiceSchema = void 0;
const zod_1 = require("zod");
exports.quizQuestionChoiceSchema = zod_1.z.object({
    content: zod_1.z.string().min(1),
    isCorrect: zod_1.z.boolean(),
    feedback: zod_1.z.string().default(""),
    imageUrl: zod_1.z.string().optional(),
});
exports.quizQuestionCreateSchema = zod_1.z.object({
    question: zod_1.z.string().min(1),
    imageUrl: zod_1.z.string().optional().nullable(),
    choices: zod_1.z.array(exports.quizQuestionChoiceSchema).min(2).refine((choices) => choices.filter((c) => c.isCorrect).length >= 1, "At least one choice must be correct"),
});
exports.quizQuestionUpdateSchema = exports.quizQuestionCreateSchema.partial().refine((value) => Object.keys(value).length > 0, "At least one field must be provided");
