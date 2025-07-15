# Example App – Next.js × nextools × shadcn‑ui

Tiny sample that shows how to:

1. **Validate** a form with Zod & React‑Hook‑Form.
2. **Generate** typed `<Field>` components via `nextools`.
3. **Submit** the form with a **server action** using Next.js app router.
4. Use shadcn‑ui primitives for styling.

---

## 1  Stack

| Layer      | Library / Tool                                         |
| ---------- | ------------------------------------------------------ |
| Framework  | Next.js 15 (app router)                                |
| UI         | shadcn‑ui                                              |
| Forms      | react‑hook‑form 7 + @hookform/resolvers                |
| Validation | Zod                                                    |
| DX helper  | `nextools` (`withFieldComponent`, `useFormWithAction`) |

---

## 2  Getting started

```bash
# 1  Clone / install deps
yarn install

# 2  Run dev server
yarn dev
```

---

## 3  Key snippets

### Field factory

```ts
const Field = withFieldComponent<FormData>({
  Field: FormField,
  Item: FormItem,
  Label: FormLabel,
  Control: FormControl,
  Message: FormMessage,
  Description: FormDescription,
});
```

### Server action (app/(auth)/login/actions/login.ts)

```ts
"use server";
export async function loginAction(_prev, data) {
  // DB / auth logic
  return { status: "success", data };
}
```

### Form usage

```tsx
<Form {...form} onSubmit={form.handleSubmit(serverAction)}>
  <Field name="username" render={(f) => <Input {...f} />} />
  <Field name="bio" render={(f) => <Textarea {...f} rows={4} />} />
  <button type="submit">Submit</button>
</Form>
```

---

## 5  License

MIT – do whatever you want but give credit ♥️
