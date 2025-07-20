import z from "zod";

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });

export type TResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
export const defaultValues = (): TResetPasswordSchema => ({
  password: "",
  confirmPassword: "",
});
