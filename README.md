# Nextools

## Forms

To create a server side form using react-hook-forms and zod, you need to define:

1. A component defining the form fields wrapped with the Form component from shadc library
2. The form schema using zod
3. Use the useFormWithAction hook to handle the form submission
4. And a server action to handle the form submission

These three must be separate files

### 1. Create a form defining the form fields

The HOC function `withFormComponents` creates a FormField based on the Form components of shadc library. This can be used to create the form fields, receiving the desired field in the `render` prop.

The form must be wrapped with the `Form` shadcn component.

Example of a form component using react-hook-forms

`form.component.tsx`

```typescript
...

// Get a customer form field, this can be global for the project
const CustomFormField = withFormComponents({
  FormField: FormField,
  FormItem: FormItem,
  FormLabel: FormLabel,
  FormControl: FormControl,
  FormDescription: FormDescription,
  FormMessage: FormMessage,
});

...

export default function Form() {
  const form = useForm();

  return <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <CustomFormField
          name="username"
          label="Username"
          render={(field) => <Input type="text" {...field} />}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
}
```

### 2. Example of a form schema using zod and defining default values

`form.schema.ts`

```typescript
import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export const loginDefaultValues = {
  username: "",
};
```

### 3. Use the useFormWithAction hook to handle the form submission

The `useFormWithAction` is a hook that creates a form with a submit action.

```typescript
type LoginSchemaType = z.infer<typeof loginSchema>;

// Define the form component and call the hook to handle the form
export default function LoginForm() {
  ...

  const { form, state, serverAction } = useFormWithAction<LoginSchemaType>(
    loginSchema,
    loginDefaultValues,
    serverLogin,
    {
      status: "idle",
    },
  );

  // define a handle submit function that calls the server action
  const handleSubmit = useCallback(
      ...
      serverAction(data);
    },
    [],
  );
```

### 4. Create a server action to handle the form submission

The server action must be an async function

Parameters:

- prevState: The previous state of the form
- formDate: The form data as an object

The response of the server action must be an object with the following properties:

- status: The status of the form (idle, success, error)
- message: A message to display in case of error
- data: The data returned by the server in case of success
