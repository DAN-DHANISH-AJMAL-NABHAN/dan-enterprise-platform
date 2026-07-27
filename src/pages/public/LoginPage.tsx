import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, KeyRound, Mail, ArrowLeft } from "lucide-react";
import { authService, type OtpChallenge } from "@/services/appwrite/auth.service";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/constants/routes";
import { identifierSchema, otpSchema, type IdentifierInput, type OtpInput } from "@/schemas/login.schema";

type Step = "identifier" | "otp";

export function LoginPage() {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [step, setStep] = useState<Step>("identifier");
  const [challenge, setChallenge] = useState<OtpChallenge | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  const identifierForm = useForm<IdentifierInput>({
    resolver: zodResolver(identifierSchema),
  });

  const otpForm = useForm<OtpInput>({
    resolver: zodResolver(otpSchema),
  });

  async function onRequestOtp(values: IdentifierInput) {
    setFormError(null);
    try {
      const result = await authService.requestOtp(values.identifier);
      setChallenge(result);
      setStep("otp");
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }
  }

  async function onVerifyOtp(values: OtpInput) {
    if (!challenge) return;
    setFormError(null);
    try {
      await authService.verifyOtp(challenge.userId, values.code);
      await refresh();
      navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
    } catch {
      setFormError("Invalid or expired code. Please try again.");
    }
  }

  async function onResend() {
    if (!challenge) return;
    setFormError(null);
    setResending(true);
    try {
      const result = await authService.requestOtp(challenge.identity);
      setChallenge(result);
      otpForm.reset();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not resend the code.");
    } finally {
      setResending(false);
    }
  }

  function onBack() {
    setFormError(null);
    setChallenge(null);
    otpForm.reset();
    setStep("identifier");
  }

  return (
    <section className="mx-auto flex max-w-md flex-col px-4 py-16">
      <h1 className="font-display text-3xl font-semibold">Admin Login</h1>
      <p className="mt-2 text-sm opacity-70">
        {step === "identifier"
          ? "Sign in with a one-time code sent to your email."
          : `Enter the 6-digit code sent to ${challenge?.identity}.`}
      </p>

      {step === "identifier" && (
        <form
          onSubmit={identifierForm.handleSubmit(onRequestOtp)}
          noValidate
          className="mt-8 flex flex-col gap-5"
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="identifier" className="text-sm font-medium">
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
              <input
                id="identifier"
                type="text"
                autoComplete="username"
                placeholder="you@company.com"
                className="w-full rounded-card border border-border bg-panel py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-primary"
                {...identifierForm.register("identifier")}
              />
            </div>
            {identifierForm.formState.errors.identifier && (
              <p className="text-xs text-red-500">
                {identifierForm.formState.errors.identifier.message}
              </p>
            )}
          </div>

          {formError && (
            <p
              role="alert"
              className="rounded-card border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-500"
            >
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={identifierForm.formState.isSubmitting}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-card bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {identifierForm.formState.isSubmitting && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            {identifierForm.formState.isSubmitting ? "Sending code..." : "Send code"}
          </button>
        </form>
      )}

      {step === "otp" && (
        <form
          onSubmit={otpForm.handleSubmit(onVerifyOtp)}
          noValidate
          className="mt-8 flex flex-col gap-5"
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="code" className="text-sm font-medium">
              6-digit code
            </label>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
              <input
                id="code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="123456"
                className="w-full rounded-card border border-border bg-panel py-2.5 pl-10 pr-3 text-sm tracking-widest outline-none transition focus:border-primary"
                {...otpForm.register("code")}
              />
            </div>
            {otpForm.formState.errors.code && (
              <p className="text-xs text-red-500">{otpForm.formState.errors.code.message}</p>
            )}
          </div>

          {formError && (
            <p
              role="alert"
              className="rounded-card border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-500"
            >
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={otpForm.formState.isSubmitting}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-card bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {otpForm.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {otpForm.formState.isSubmitting ? "Verifying..." : "Verify & sign in"}
          </button>

          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1 opacity-70 transition hover:opacity-100"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Use a different email
            </button>
            <button
              type="button"
              onClick={onResend}
              disabled={resending}
              className="opacity-70 transition hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {resending ? "Resending..." : "Resend code"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}