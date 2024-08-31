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
