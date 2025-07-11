// import ReactDOM from "react-dom";
import { useActionState } from "react";

import { useForm, UseFormReturn, FieldValues } from "react-hook-form";
import type { DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodSchema } from "zod";

/**
 * This function is used to check if a form is valid, based on a Zod schema.
 */
export function isFormDataValid(schema: ZodSchema<any>, formData: any) {
  const { success } = schema.safeParse(formData);
  return success;
}

/**
 * This works only with the `zod` library, using the `safeParse` method
 * returns an an `errors` array.
 * @param errors
 * @returns string[] - an array of strings with the error messages
 */
export function getFormDataErrors(
  schema: ZodSchema<any>,
  formData: any,
): string[] {
  const result = schema.safeParse(formData);
  if (result.success) return [];
  return result.error.errors.map((err: { message: string }) => err.message);
}

/* -------------------------------------------------------------------------- */
/*               Optional helper → RHF + server actions (Next JS)           */
/* -------------------------------------------------------------------------- */

export type ActionStatus = "idle" | "loading" | "success" | "error";

export interface ActionState<T extends FieldValues = FieldValues> {
  status: ActionStatus;
  data?: T;
  message?: string;
}

export type ServerAction<T extends FieldValues = FieldValues> = (
  prev: ActionState<T>,
  formData: T,
) => Promise<ActionState<T>>;

export function useFormWithAction<T extends FieldValues>(
  schema: ZodSchema<T>,
  defaultValues: DefaultValues<T>,
  action: ServerAction<T>,
  initialState: ActionState<T> = { status: "idle" },
): {
  form: UseFormReturn<T>; // default generics <T, any, undefined>
  state: ActionState<T>;
  serverAction: (data: T) => void;
} {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore – `useFormState` types not publicly exported (Next 13.x)
  const [state, serverAction] = useActionState<ActionState<T>, T>(
    action,
    initialState,
  );

  return { form, state, serverAction };
}
