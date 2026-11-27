import { z } from 'zod';

export const signUpRequestSchema = z.object({
    displayName: z.string().trim().min(1).max(120),
    email: z.email().trim().max(320),
    password: z.string().min(12).max(1_024),
});

export const signInRequestSchema = z.object({
    email: z.email().trim().max(320),
    password: z.string().min(1).max(1_024),
});
