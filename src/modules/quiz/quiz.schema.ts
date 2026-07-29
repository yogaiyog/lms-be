import { z } from "zod";

export const quizQuestionChoiceSchema = z.object({
  content: z.string().min(1),
  isCorrect: z.boolean(),
  feedback: z.string().default(""),
  imageUrl: z.string().optional(),
});

export const quizQuestionCreateSchema = z.object({
  question: z.string().min(1),
  imageUrl: z.string().optional().nullable(),
  choices: z.array(quizQuestionChoiceSchema).min(2).refine(
    (choices) => choices.filter((c) => c.isCorrect).length >= 1,
    "At least one choice must be correct",
  ),
});

export const quizQuestionUpdateSchema = quizQuestionCreateSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "At least one field must be provided",
);
