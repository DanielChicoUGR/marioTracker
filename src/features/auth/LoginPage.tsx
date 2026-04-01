import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { upsertProfileFromUser } from "@/features/auth/profileSync";
import { supabase } from "@/lib/supabaseClient";

const schema = z.object({
  email: z.string().email("Email no válido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  displayName: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", displayName: "" },
  });

  async function onSubmit(values: FormValues) {
    setFormError(null);
    try {
      if (mode === "register") {
        if (!values.displayName || values.displayName.trim().length < 2) {
          setFormError("Nombre visible requerido (mín. 2 caracteres)");
          return;
        }
        const { data, error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
        });
        if (error) {
          setFormError(error.message);
          return;
        }
        if (data.user) {
          await upsertProfileFromUser(data.user, values.displayName);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
        if (error) {
          setFormError(error.message);
          return;
        }
        if (data.user) {
          await upsertProfileFromUser(data.user);
        }
      }
      navigate("/", { replace: true });
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Error inesperado");
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>{mode === "login" ? "Entrar" : "Crear cuenta"}</CardTitle>
          <CardDescription>
            Mario Tracker — sesión segura vía Supabase Auth.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {mode === "register" && (
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre visible</FormLabel>
                      <FormControl>
                        <Input autoComplete="nickname" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" autoComplete="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoComplete={
                          mode === "login" ? "current-password" : "new-password"
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {formError ? (
                <p className="text-sm font-semibold text-red-700" role="alert">
                  {formError}
                </p>
              ) : null}
              <Button type="submit" className="w-full">
                {mode === "login" ? "Iniciar sesión" : "Registrarse"}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            <button
              type="button"
              className="font-bold text-[var(--color-mario-red)] underline"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setFormError(null);
              }}
            >
              {mode === "login"
                ? "¿Sin cuenta? Registrarse"
                : "¿Ya tienes cuenta? Entrar"}
            </button>
          </div>
          <p className="mt-4 text-center text-xs text-neutral-600">
            <a className="underline" href="/legacy/index.html" target="_blank" rel="noreferrer">
              Abrir tracker clásico (HTML)
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
