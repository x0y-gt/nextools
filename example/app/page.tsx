// app/(auth)/login/page.tsx   ←  🖥️  client
"use client";

import React from "react";
import { z } from "zod";
import { withFieldComponent } from "nextools";
import { useFormWithAction } from "nextools/forms";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
  Form,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { loginAction } from "./action.login"; // <-- import server action

/* ---------- schema must match the one on the server ---------- */
const schema = z.object({
  username: z.string().min(2, { message: "Required" }),
  bio: z.string().min(10, { message: "Tell us a bit more" }),
});
type FormData = z.infer<typeof schema>;

/* ---------- Field factory bound to FormData ---------- */
const Field = withFieldComponent<FormData>({
  Field: FormField,
  Item: FormItem,
  Label: FormLabel,
  Control: FormControl,
  Message: FormMessage,
  Description: FormDescription,
});

export default function LoginPage() {
  const { form, serverAction, state } = useFormWithAction<FormData>(
    schema,
    { username: "", bio: "" }, // defaultValues
    loginAction, // <-- server action
  );

  return (
    <div className="p-8 max-w-md mx-auto">
      {/* you can show the action state if you need */}
      {state.status === "success" && (
        <p className="mb-4 text-green-600">User saved ✔</p>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => serverAction(data))}>
          <Field
            name="username"
            label="Username"
            render={(f) => <Input {...f} placeholder="Username" />}
          />

          <Field
            name="bio"
            label="Bio"
            description="Min. 10 characters"
            render={(f) => (
              <Textarea {...f} rows={4} placeholder="About you…" />
            )}
          />

          <Button className="mt-4 btn-primary" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
