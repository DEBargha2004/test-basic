import * as z from "zod";

export const signInSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean(),
});

export type TSignInSchema = z.infer<typeof signInSchema>;

export const defaultValues = (): TSignInSchema => ({
  email: "",
  password: "",
  rememberMe: false,
});
