import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { TResetPasswordSchema } from "@/schema/reset-password";
import { TFormDefaultParams } from "@/types/form-default-params";
import { useState } from "react";
import IconInput from "../icon-input";
import { Eye, EyeClosed, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ResetPasswordForm({
  form,
  onSubmit,
}: TFormDefaultParams<TResetPasswordSchema>) {
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <IconInput
                  {...field}
                  type={showPassword.password ? "text" : "password"}
                  EndIcon={
                    <div
                      onClick={() =>
                        setShowPassword({
                          ...showPassword,
                          password: !showPassword.password,
                        })
                      }
                      className="[&_svg]:size-5 cursor-pointer"
                    >
                      {showPassword.password ? <Eye /> : <EyeClosed />}
                    </div>
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <IconInput
                  {...field}
                  type={showPassword.confirmPassword ? "text" : "password"}
                  EndIcon={
                    <div
                      onClick={() =>
                        setShowPassword({
                          ...showPassword,
                          confirmPassword: !showPassword.confirmPassword,
                        })
                      }
                      className="[&_svg]:size-5 cursor-pointer"
                    >
                      {showPassword.confirmPassword ? <Eye /> : <EyeClosed />}
                    </div>
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="self-end w-fit"
        >
          {form.formState.isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            <span>Reset Password</span>
          )}
        </Button>
      </form>
    </Form>
  );
}
