import React from "react";
// @ts-ignore
import { useFormState } from "react-dom";

import { useForm, UseFormReturn, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodSchema } from "zod";

import { mergeClasses } from "./utils";

type FormComponentType = React.ForwardRefExoticComponent<
  React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
>;

interface withFormComponentsProps {
  FormField: any; // TODO: Fix this type
  FormItem: FormComponentType;
  FormLabel: any; // TODO: Fix this type
  FormControl: any; // TODO: Fix this type
  FormDescription?: FormComponentType;
  FormMessage?: FormComponentType;
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
}: withFormComponentsProps): React.FC<CustomFormFieldProps> {
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

export interface iActionState {
  status: string; // TODO: Define a type for this, such as "idle" | "loading" | "success" | "error"
  data?: FieldValues;
  message?: string;
}

export interface iAction {
  (prevState: any, formData: FormData): Promise<iActionState>;
}

export function useFormWithAction<FF extends FieldValues>(
  schema: ZodSchema<FF>,
  defaultValues: any,
  action: iAction,
  initialState?: iActionState,
): {
  form: UseFormReturn<FF>;
  state: FF;
  serverAction: (data: FF) => void;
} {
  const form = useForm<FF>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const [state, serverAction] = useFormState(
    action,
    initialState || { status: "idle" },
  );

  return { form, state, serverAction };
}
