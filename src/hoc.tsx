import React from "react";
import { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form";
import { mergeClasses } from "./utils";

export type Primitive<P = React.HTMLAttributes<HTMLElement>> =
  | React.ComponentType<P>
  | React.ExoticComponent<P>;

export interface FormPrimitives {
  Field: React.ComponentType<any>;

  Item: Primitive;
  Label: Primitive;
  Control: Primitive;
  Message?: Primitive;
  Description?: Primitive;
}

export function withFieldComponent<T extends FieldValues>(
  primitives: FormPrimitives,
) {
  const {
    Field: ShadcnField,
    Item,
    Label,
    Control,
    Message = React.Fragment,
    Description = React.Fragment,
  } = primitives;

  const FieldComponent = ({
    name,
    label,
    description,
    className,
    render,
    ...rest
  }: {
    name: FieldPath<T>;
    label?: React.ReactNode;
    description?: React.ReactNode;
    className?: string;
    render: (field: ControllerRenderProps<T, any>) => React.ReactElement;
  } & React.HTMLAttributes<HTMLElement>) => {
    return (
      <ShadcnField
        name={name}
        {...rest}
        render={({ field }) => (
          <Item className={mergeClasses("form-item", className)}>
            {label && <Label>{label}</Label>}
            <Control>{render(field)}</Control>
            {description && <Description>{description}</Description>}
            <Message />
          </Item>
        )}
      />
    );
  };

  FieldComponent.displayName = "NextToolsField";
  return FieldComponent;
}
