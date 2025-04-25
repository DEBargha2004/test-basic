import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useCompressImage from "@/hooks/use-compress-image";
import useFileReader from "@/hooks/use-file-reader";
import { getAcronym } from "@/lib/utils";
import { TProfileSchema } from "@/schema/profile";
import { TFormDefaultParams } from "@/types/form-default-params";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";

export default function ProfileForm({
  form,
  onSubmit,
}: TFormDefaultParams<TProfileSchema>) {
  const avatarRef = useRef<HTMLInputElement>(null);

  const { read } = useFileReader();
  const { compress } = useCompressImage();

  useEffect(() => {
    const controller = new AbortController();

    if (avatarRef.current) {
      avatarRef.current.addEventListener("change", (e) => {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
          read(file)
            .then((res) => compress(res, 0.5))
            .then((res) => form.setValue("avatar", res));
        }
      });
    }

    return () => controller.abort();
  }, []);
  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <Avatar
          className="size-36 mx-auto"
          onClick={() => avatarRef.current?.click()}
        >
          <AvatarImage src={form.watch("avatar")} />
          <AvatarFallback>{getAcronym(form.watch("name"))}</AvatarFallback>
        </Avatar>
        <input
          hidden
          type="file"
          accept="image/*"
          id="avatar"
          ref={avatarRef}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
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
            <span>Save</span>
          )}
        </Button>
      </form>
    </Form>
  );
}
