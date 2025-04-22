import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TSignInSchema } from "@/schema/sign-in";
import { TFormDefaultParams } from "@/types/form-default-params";
import IconInput from "../icon-input";
import { Eye, EyeClosed, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Label } from "@/components/ui/label";

export default function SignInForm({
  form,
  onSubmit,
}: TFormDefaultParams<TSignInSchema>) {
  const [showPass, setShowPass] = useState(false);
  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <IconInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-baseline">
                <FormLabel>Password</FormLabel>
                <Link href={"/auth/forget-password"}>
                  <FormLabel className="underline cursor-pointer">
                    Forget Password
                  </FormLabel>
                </Link>
              </div>
              <FormControl>
                <IconInput
                  {...field}
                  type={showPass ? "text" : "password"}
                  EndIcon={
                    <div
                      onClick={() => setShowPass(!showPass)}
                      className="[&_svg]:size-5 cursor-pointer"
                    >
                      {showPass ? <Eye /> : <EyeClosed />}
                    </div>
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rememberMe"
          render={({ field }) => (
            <FormItem className="space-y-0 flex justify-start items-center gap-3">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Remember Me</FormLabel>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
    </Form>
  );
}
