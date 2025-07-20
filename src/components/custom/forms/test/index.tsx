"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { TTestSchema } from "@/schema/test";
import { TFormDefaultParams } from "@/types/form-default-params";
import React from "react";
import TestBasicDetails from "./basic-details";
import TestQuestionDetails from "./question-details";
import TestThumbnailDetails from "./thumbnail-details";
import TestPublishingDetails from "./publishing-details";

export default function TestForm({
  form,
  onSubmit,
}: TFormDefaultParams<TTestSchema>) {
  return (
    <Form {...form}>
      <form
        className="grid grid-cols-3 gap-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <section className="col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Details</CardTitle>
              <CardDescription>Fill up the test details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <TestBasicDetails form={form} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Questions</CardTitle>
              <CardDescription>Create questions for the test</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <TestQuestionDetails form={form} />
            </CardContent>
          </Card>
        </section>
        <section className="col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thumbnail</CardTitle>
            </CardHeader>
            <CardContent>
              <TestThumbnailDetails form={form} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Publishing Options</CardTitle>
            </CardHeader>
            <CardContent>
              <TestPublishingDetails form={form} />
            </CardContent>
          </Card>
        </section>
      </form>
    </Form>
  );
}
