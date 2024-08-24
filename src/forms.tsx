import React from "react";

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
