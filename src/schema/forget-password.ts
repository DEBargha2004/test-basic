import z from "zod";

export const forgetPasswordSchema = z.object({
  email: z.string().email(),
});

export type TForgetPasswordSchema = z.infer<typeof forgetPasswordSchema>;
export const defaultValues = (): TForgetPasswordSchema => ({
  email: "",
});
