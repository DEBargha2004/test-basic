import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TTestSchema } from "@/schema/test";
import { TFormChildrenDefaultParams } from "@/types/form-default-params";
import IconInput from "../../icon-input";
import { Clock, Minus, Plus } from "lucide-react";

export default function TestBasicDetails({
  form,
}: TFormChildrenDefaultParams<TTestSchema>) {
  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Description"
                {...field}
                className="resize-none"
                style={
                  {
                    fieldSizing: "content",
                  } as React.CSSProperties
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Duration <i>(in minutes)</i>
              </FormLabel>
              <FormControl>
                <IconInput
                  StartIcon={<Clock />}
                  placeholder="Duration"
                  type="number"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="totalMarks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Marks</FormLabel>
              <FormControl>
                <Input
                  placeholder="Total Marks"
                  type="number"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="passMarks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Passing Marks</FormLabel>
              <FormControl>
                <Input
                  placeholder="Passing Marks"
                  type="number"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={`marksDistribution.positive`}
          render={({ field }) => (
            <FormItem className="w-full">
              {/* <FormLabel className="font-normal">Positive Marks</FormLabel> */}
              <FormControl>
                <IconInput
                  StartIcon={<Plus />}
                  placeholder="Positive Marks"
                  {...field}
                  type="number"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`marksDistribution.negative`}
          render={({ field }) => (
            <FormItem className="w-full">
              {/* <FormLabel className="font-normal">Positive Marks</FormLabel> */}
              <FormControl>
                <IconInput
                  StartIcon={<Minus />}
                  placeholder="Negative Marks"
                  {...field}
                  type="number"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
