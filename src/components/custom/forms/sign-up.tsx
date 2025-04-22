import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TSignUpSchema } from "@/schema/sign-up";
import { TFormDefaultParams } from "@/types/form-default-params";
import IconInput from "../icon-input";
import { Eye, EyeClosed, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import FileInput from "../file-input";
import useFileReader from "@/hooks/use-file-reader";
import useCompressImage from "@/hooks/use-compress-image";

export default function SignUpForm({
  form,
  onSubmit,
}: TFormDefaultParams<TSignUpSchema>) {
  const [showPass, setShowPass] = useState({
    password: false,
    confirmPassword: false,
  });
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const { read } = useFileReader();
  const { compress } = useCompressImage();

  useEffect(() => {
    const controller = new AbortController();

    if (avatarInputRef.current) {
      avatarInputRef.current.addEventListener(
        "change",
        (e) => {
          const target = e.target as HTMLInputElement;

          const file = target.files?.[0];
          if (file) {
            read(file)
              .then((res) => {
                return compress(res, 0.5);
              })
              .then((res) => {
                // console.log(res);
                form.setValue("avatar", res);
              });
          }
        },
        {
          signal: controller.signal,
        }
      );
    }

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <IconInput
                  {...field}
                  type={showPass.password ? "text" : "password"}
                  EndIcon={
                    <div
                      onClick={() =>
                        setShowPass({
                          ...showPass,
                          password: !showPass.password,
                        })
                      }
                    >
                      {showPass.password ? <Eye /> : <EyeClosed />}
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
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <IconInput
                  {...field}
                  type={showPass.confirmPassword ? "text" : "password"}
                  EndIcon={
                    <div
                      onClick={() =>
                        setShowPass({
                          ...showPass,
                          confirmPassword: !showPass.confirmPassword,
                        })
                      }
                    >
                      {showPass.confirmPassword ? <Eye /> : <EyeClosed />}
                    </div>
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FileInput accept="image/*" ref={avatarInputRef} />
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Sign Up"
          )}
        </Button>
      </form>
    </Form>
  );
}
