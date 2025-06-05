"use client";

import * as React from "react";
import ReactDOM from "react-dom";
import {
  FieldPath,
  FieldValues,
  ControllerRenderProps,
  useController,
  UseControllerProps,
  UseFormReturn,
  useForm,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodSchema } from "zod";
import clsx from "clsx";

/* -------------------------------------------------------------------------- */
/* 1. COMPONENT FACTORY                                                       */
/* -------------------------------------------------------------------------- */

type OptionalComponent = React.ComponentType<{ className?: string }>;

export interface ComponentSet {
  Item: OptionalComponent;
  Label: OptionalComponent;
  Control: OptionalComponent;
  Message: OptionalComponent;
  Description: OptionalComponent;
}

/**
 * Returns a strongly typed `<Field>` component bound to the provided
 * rhf `useForm` context. Accepts a custom component set so you can
 * theme or replace them project-wide from a single place.
 */
export function createFieldComponent<TV extends FieldValues>(
  components: ComponentSet,
) {
  const { Item, Label, Control, Message, Description } = components;

  return function Field<P extends FieldPath<TV>>({
    name,
    label,
    description,
    className,
    control,
    render,
    ...controllerProps
  }: {
    name: P;
    control?: UseFormReturn<TV>["control"];
    label?: React.ReactNode;
    description?: React.ReactNode;
    className?: string;
    render: (field: ControllerRenderProps<TV, P>) => React.ReactElement;
  } & Omit<UseControllerProps<TV, P>, "name" | "control">) {
    const ctxControl = useRHFControl<TV>();
    const { field, fieldState } = useController<TV, P>({
      name,
      control: control || ctxControl,
      ...controllerProps,
    });

    return (
      <Item className={clsx("form-item", className)}>
        {label && <Label>{label}</Label>}
        <Control>{render(field)}</Control>
        {description && <Description>{description}</Description>}
        {fieldState.error?.message && <Message>{fieldState.error.message}</Message>}
      </Item>
    );
  };
}

/* -------------------------------------------------------------------------- */
/* 1.1  Small helper hook – grabs the RHF control from context if not supplied */
/* -------------------------------------------------------------------------- */
function useRHFControl<T extends FieldValues>() {
  const { useFormContext } = require("react-hook-form") as typeof import("react-hook-form");
  const ctx = useFormContext<T>();
  if (!ctx) {
    throw new Error(
      "<Field> requires either a `control` prop or to be rendered inside a <FormProvider>.",
    );
  }
  return ctx.control;
}

/* -------------------------------------------------------------------------- */
/* 2. RHF + Async Action helper                                               */
/* -------------------------------------------------------------------------- */

type ActionStatus = "idle" | "loading" | "success" | "error";

export interface ActionState<T extends FieldValues = FieldValues> {
  status: ActionStatus;
  data?: T;
  message?: string;
}

export interface ServerAction<T extends FieldValues, R extends ActionState<T>> {
  (prevState: R, formData: T): Promise<R>;
}

export function useFormWithAction<
  T extends FieldValues,
  R extends ActionState<T> = ActionState<T>,
>(
  schema: ZodSchema<T>,
  defaultValues: T,
  action: ServerAction<T, R>,
  initialState: R = { status: "idle" } as R,
) {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // @ts-expect-error experimental React / next-server-actions typing
  const [state, serverAction] = ReactDOM.useFormState<R, T>(
    action,
    initialState,
  );

  return { form, state, serverAction } as const;
}

