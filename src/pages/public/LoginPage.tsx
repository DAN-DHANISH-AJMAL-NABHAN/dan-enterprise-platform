import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, Mail } from "lucide-react";
import { authService } from "@/services/appwrite/auth.service";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/constants/routes";
import { loginSchema, type LoginInput } from "@/schemas/login.schema";

export function LoginPage() {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: LoginInput) {
    setFormError(null);
    try {
      await authService.loginWithEmail(values.email, values.password);
      await refresh();
      navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
    } catch {
      setFormError("Invalid email or password. Please try again.");
    }
  }

  return (
    <section className="mx-auto flex max-w-md flex-col px-4 py-16">
      <h1 className="font-display text-3xl font-semibold">Admin Login</h1>
      <p className="mt-2 text-sm opacity-70">Sign in to access the admin dashboard.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              className="w-full rounded-card border border-border bg-panel py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-primary"
              {...register("email")}
            />
          </div>
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full rounded-card border border-border bg-panel py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-primary"
              {...register("password")}
            />
          </div>
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>

        {formError && (
          <p role="alert" className="rounded-card border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-500">
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-card bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </section>
  );
}