"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LogIn } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginInput } from "@/modules/foundation/validation/auth-schema";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit() {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 450));
    setSubmitting(false);

    toast.success("Clinical workstation session opened", {
      description: "Demo mode uses seeded operational data and local UI state.",
    });
    router.push(searchParams.get("callbackUrl") ?? "/workspace");
    router.refresh();
  }

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" placeholder="doctor@stmarys.local" {...form.register("email")} />
        {form.formState.errors.email ? <p className="text-xs text-destructive">{form.formState.errors.email.message}</p> : null}
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" autoComplete="current-password" placeholder="clinical-demo" {...form.register("password")} />
        {form.formState.errors.password ? <p className="text-xs text-destructive">{form.formState.errors.password.message}</p> : null}
      </div>
      <Button type="submit" disabled={submitting}>
        {submitting ? <Loader2 className="animate-spin" /> : <LogIn />}
        Sign in
      </Button>
    </form>
  );
}
