"use server";

import { z } from "zod";
import type { ActionState } from "nextools/forms"; // same shape your helper expects

const schema = z.object({
  username: z.string().min(2, { message: "Required" }),
  bio: z.string().min(10, { message: "Tell us a bit more" }),
});
type FormData = z.infer<typeof schema>;

/** This runs on the server every time the form is posted */
export async function loginAction(
  _prev: ActionState<FormData>,
  data: FormData,
): Promise<ActionState<FormData>> {
  // …do DB/auth work here
  console.log("Form submitted:", data);
  return { status: "success", data };
}
