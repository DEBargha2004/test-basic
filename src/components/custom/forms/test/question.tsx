import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  defaultOption,
  defaultQuestion,
  rebalanceSerial,
  TTestSchema,
} from "@/schema/test";
import { TFormChildrenDefaultParams } from "@/types/form-default-params";
import { Minus, Plus, Trash2 } from "lucide-react";
import React from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import IconInput from "../../icon-input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SafeRemove from "../../safe-remove";

export default function Question({
  form,
  index,
}: TFormChildrenDefaultParams<TTestSchema> & {
  index: number;
}) {
  const { fields } = useFieldArray({
    control: form.control,
    name: `questions.${index}.options`,
  });

  const question = useWatch({
    control: form.control,
    name: `questions.${index}`,
  });

  const handleSetCorrectOption = (option: string) => {
    form.setValue(`questions.${index}.correctOptionId`, option);
  };

  const handleAddNewOption = (opidx: number) => {
    const prevOptions = form.getValues(`questions.${index}.options`);
    // console.log(prevOptions);
    // console.log(form.getValues());
    prevOptions.splice(opidx, 0, defaultOption(opidx + 1));
    form.setValue(`questions.${index}.options`, prevOptions);
  };

  const handleDeleteOption = (opidx: number) => {
    const prevOptions = form.getValues(`questions.${index}.options`);
    prevOptions.splice(opidx, 1);
    rebalanceSerial(prevOptions, "serial");
    if (prevOptions.length === 0) prevOptions.splice(0, 1, defaultOption(1));
    form.setValue(`questions.${index}.options`, prevOptions);
  };

  const handleDeleteQuestion = () => {
    const prevQuestions = form.getValues("questions");
    prevQuestions.splice(index, 1);
    rebalanceSerial(prevQuestions, "serial");
    if (prevQuestions.length === 0)
      prevQuestions.splice(0, 1, defaultQuestion(1));
    form.setValue("questions", prevQuestions);
  };
  return (
    <div className="space-y-4 w-full">
      <div className="flex justify-start items-center gap-2">
        <SafeRemove action={handleDeleteQuestion}>
          <Button variant={"destructive"} type="button" className="ml-auto">
            <Trash2 />
            <span>Delete</span>
          </Button>
        </SafeRemove>
      </div>
      <FormField
        control={form.control}
        name={`questions.${index}.title`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Textarea
                {...field}
                className="max-h-32 resize-none"
                style={{ fieldSizing: "content" } as React.CSSProperties}
                placeholder="Describe your question"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {fields.map((option, op_idx) => (
        <div key={option.id} className="flex justify-start items-start gap-2">
          <Checkbox
            checked={option.opid === question.correctOptionId}
            onCheckedChange={(e) =>
              handleSetCorrectOption(e ? option.opid : "")
            }
            className="cursor-pointer mt-1"
          />
          <FormField
            control={form.control}
            name={`questions.${index}.options.${op_idx}.text`}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input placeholder={`Option ${option.serial}`} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            variant={"destructive"}
            size={"icon"}
            type="button"
            className="rounded-full"
            onClick={() => handleDeleteOption(op_idx)}
          >
            <Trash2 />
          </Button>
        </div>
      ))}
      <Button
        variant={"secondary"}
        type="button"
        onClick={() => handleAddNewOption(fields.length)}
      >
        <Plus />
        <span>Add Option</span>
      </Button>
    </div>
  );
}
