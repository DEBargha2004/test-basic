import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { publishingStatus } from "@/constants/tabs";
import { TTestSchema } from "@/schema/test";
import { TFormChildrenDefaultParams } from "@/types/form-default-params";
import { Loader2, Upload } from "lucide-react";

export default function TestPublishingDetails({
  form,
}: TFormChildrenDefaultParams<TTestSchema>) {
  return (
    <>
      <FormField
        control={form.control}
        name="publishingStatus"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {publishingStatus.map((op) => (
                    <SelectItem key={op.id} value={op.id}>
                      {op.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        )}
      />
      <Button
        type="submit"
        className="bg-green-500 hover:bg-green-600 text-foreground w-full mt-4"
        disabled={
          form.formState.isSubmitting || form.formState.isSubmitSuccessful
        }
      >
        {form.formState.isSubmitting ? <Loader2 /> : <Upload />}
        <span>Submit</span>
      </Button>
    </>
  );
}
