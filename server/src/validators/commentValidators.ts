import { z } from 'zod';

const trimmedRequiredString = (max: number) =>
  z
    .string()
    .trim()
    .min(1, 'Required')
    .max(max, `Must be at most ${max} characters`);

const userIdSchema = z
  .number({ error: 'Must be a positive integer' })
  .int()
  .positive();

export const createCommentSchema = z.object({
  message: trimmedRequiredString(2000),
  createdBy: userIdSchema,
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;

export function parseCreateCommentInput(body: unknown): CreateCommentInput {
  return createCommentSchema.parse(body);
}
