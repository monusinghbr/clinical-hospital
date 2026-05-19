import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormField<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  type?: string;
  placeholder?: string;
};

type FormBuilderProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  fields: FormField<T>[];
};

export function FormBuilder<T extends FieldValues>({ form, fields }: FormBuilderProps<T>) {
  return (
    <div className="grid gap-3">
      {fields.map((field) => (
        <div key={field.name} className="grid gap-1.5">
          <Label htmlFor={field.name}>{field.label}</Label>
          <Input id={field.name} type={field.type ?? "text"} placeholder={field.placeholder} {...form.register(field.name)} />
          {form.formState.errors[field.name] ? (
            <p className="text-xs text-destructive">{String(form.formState.errors[field.name]?.message)}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
