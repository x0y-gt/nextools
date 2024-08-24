import React from "react";
// @ts-ignore
import { useFormState } from "react-dom";

import { useForm, UseFormReturn, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodSchema } from "zod";

import { mergeClasses } from "./utils";

interface withFormComponentsProps {
  FormField: typeof React.Component;
  FormItem: typeof React.Component;
  FormLabel: typeof React.Component;
  FormControl: typeof React.Component;
  FormDescription?: typeof React.Component;
  FormMessage?: typeof React.Component;
}

interface CustomFormFieldProps {
  name: string;
  label?: string;
  description?: React.ReactNode;
  className?: string | string[];
  render: (field: any) => React.ReactElement;
}

/**
 * This function is a higher order component that takes a configuration object
 * with the form components to be used (FormField, FormItem, FormLabel, FormControl,
 * FormDescription, FormMessage)
 * and returns a function that can be used to create custom form fields.
 */
export function withFormComponents({
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
}: withFormComponentsProps): Function {
  // (props: CustomFormFieldProps) => JSX.Element {
  return function CustomFormField({
    name,
    label,
    description,
    className,
    render,
  }: CustomFormFieldProps) {
    return (
      <FormField
        key={name}
        name={name}
        render={({ field }: any) => (
          <FormItem className={mergeClasses("form-item", className || "")}>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              {/*React.cloneElement(input as React.ReactElement<any>, { ...field })*/}
              {render(field)}
            </FormControl>
            {description && FormDescription && (
              <FormDescription className="form-item-description">
                {description}
              </FormDescription>
            )}
            {FormMessage && <FormMessage className="form-item-message" />}
          </FormItem>
        )}
      />
    );
  };
}

type Action<T, S> = (currentState: S, formData: T) => Promise<S>;

export function useFormWithAction<ST extends FieldValues, AS>(
  schema: ZodSchema<ST>,
  defaultValues: ST,
  action: Action<ST, AS>,
  initialState: AS,
): {
  form: UseFormReturn<ST>;
  state: AS;
  formAction: (data: ST) => void;
  pending: boolean;
} {
  const form = useForm<ST>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const [state, formAction, pending] = useFormState(action, initialState);

  return { form, state, formAction, pending };
}
