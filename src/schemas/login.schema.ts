import { z } from "zod";

/** Step 1: accepts an email. */
export const identifierSchema = z.object({
    identifier: z
        .string()
        .min(1, "Enter your email")
        .refine(
            (value) =>
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
            "Enter a valid email",
        ),
});

export type IdentifierInput = z.infer<typeof identifierSchema>;

/** Step 2: the OTP code sent to the verified email. */
export const otpSchema = z.object({
    code: z
        .string()
        .min(6, "Enter the 6-digit code")
        .max(6, "Enter the 6-digit code")
        .regex(/^\d{6}$/, "Code must be 6 digits"),
});

export type OtpInput = z.infer<typeof otpSchema>;