"use client";

import React, { useState } from "react";

type LoginValues = { email: string; pass: string };
type LoginErrors = Partial<Record<keyof LoginValues, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const MailIcon = (
  <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
    <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
    <path d="M22 6l-10 7L2 6" />
  </svg>
);
const LockIcon = (
  <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

function Field({
  id, label, type = "text", value, onChange, error, icon, autoComplete, trailing,
}: {
  id: string; label: string; type?: string; value: string;
  onChange: (v: string) => void; error?: string; icon: React.ReactNode;
  autoComplete?: string; trailing?: React.ReactNode;
}) {
  return (
    <div>
      <div
        className={`group relative overflow-hidden rounded-xl border bg-black/40 backdrop-blur-md transition-all duration-300 focus-within:border-accent focus-within:shadow-[0_0_22px_-4px_var(--accent)] ${
          error ? "border-red-500/80" : "border-nav-right-line hover:border-nav-right-ring"
        }`}
      >
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-nav-right-text/60 transition-colors group-focus-within:text-accent">
          {icon}
        </span>
        <input
          id={id}
          type={type}
          value={value}
          placeholder=" "
          autoComplete={autoComplete}
          aria-invalid={!!error}
          onChange={(e) => onChange(e.target.value)}
          className="peer w-full bg-transparent pb-2 pl-11 pr-14 pt-5 text-sm text-nav-right-heading outline-none placeholder-transparent"
        />
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-11 top-2 text-[9px] uppercase tracking-[0.18em] text-nav-right-text/70 transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[9px] peer-focus:uppercase peer-focus:tracking-[0.18em] peer-focus:text-accent"
        >
          {label}
        </label>
        {trailing}
      </div>
      {error && <p className="mt-1 text-[11px] text-red-400">{error}</p>}
    </div>
  );
}

export default function Login({ onSwitchToSignup }: { onSwitchToSignup?: () => void }) {
  const [values, setValues] = useState<LoginValues>({ email: "", pass: "" });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [shake, setShake] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleChange = (field: keyof LoginValues, val: string) => {
    setValues((p) => ({ ...p, [field]: val }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const validate = () => {
    const errs: LoginErrors = {};
    if (!EMAIL_RE.test(values.email.trim())) errs.email = "Enter a valid email address";
    if (values.pass.length < 6) errs.pass = "Password must be at least 6 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    setStatus("submitting");
    // TODO: replace with your real login call, e.g. await signIn("credentials", {...})
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("success");
  };

  /* ---------- success state ---------- */
  if (status === "success") {
    return (
      <div className="flex h-full min-h-[420px] w-full flex-col items-center justify-center p-8 text-center">
        <div className="ct-pop mb-5 flex h-20 w-20 items-center justify-center rounded-full border-2 border-accent bg-accent/10 shadow-[0_0_40px_-5px_var(--accent)]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-9 w-9 text-accent">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="font-serif text-2xl font-extrabold uppercase tracking-wide text-nav-right-heading">
          Welcome Back, Champion
        </h3>
        <p className="mt-2 max-w-xs text-sm text-nav-right-text/80">
          The gates of the WC-Universe are open. Your comics are waiting.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-xs font-bold uppercase tracking-wider text-accent hover:underline"
        >
          Back to login
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col justify-between p-6 sm:p-10">
      <div>
        <div className="mb-6 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            Warrior Portal
          </span>
          <span className="text-xs text-nav-right-text/70">Welcome back, Champion</span>
        </div>

        <h3 className="mb-2 font-serif text-2xl font-extrabold uppercase tracking-wide text-nav-right-heading sm:text-3xl">
          Enter The Arena
        </h3>
        <p className="mb-8 text-xs leading-relaxed text-nav-right-text/80 sm:text-sm">
          Log in to access your digital comics, saved universes and hero profile.
        </p>

        <form onSubmit={handleSubmit} noValidate className={`space-y-5 ${shake ? "ct-shake" : ""}`}>
          <Field
            id="login-email" label="Warrior Email" type="email" autoComplete="email"
            value={values.email} onChange={(v) => handleChange("email", v)}
            error={errors.email} icon={MailIcon}
          />
          <Field
            id="login-pass" label="Secret Key" autoComplete="current-password"
            type={showPass ? "text" : "password"}
            value={values.pass} onChange={(v) => handleChange("pass", v)}
            error={errors.pass} icon={LockIcon}
            trailing={
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold tracking-wider text-nav-right-text/60 transition-colors hover:text-accent"
              >
                {showPass ? "HIDE" : "SHOW"}
              </button>
            }
          />

          <div className="flex items-center justify-between text-xs text-nav-right-text/80">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="rounded border-nav-right-line bg-black/40 text-accent focus:ring-accent"
              />
              Remember me
            </label>
            <a href="#forgot" className="text-accent hover:underline" onClick={(e) => e.preventDefault()}>
              Forgot secret key?
            </a>
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="group relative w-full overflow-hidden rounded-xl bg-accent py-3.5 font-serif text-xs font-extrabold uppercase tracking-[0.2em] text-accent-fg transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,100,0,0.5)] active:scale-[0.98] disabled:opacity-60"
          >
            <span className="relative z-10">
              {status === "submitting" ? "Authenticating..." : "Login to WC-Universe"}
            </span>
            <span className="absolute inset-0 -translate-x-full bg-white/25 transition-transform duration-500 group-hover:translate-x-0" />
          </button>
        </form>
      </div>

      <div className="mt-8 border-t border-nav-right-line/40 pt-6 text-center">
        <p className="text-xs text-nav-right-text/70">
          Need a Warrior identity?{" "}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="font-bold uppercase tracking-wider text-accent hover:underline focus:outline-none"
          >
            Create Account
          </button>
        </p>
      </div>
    </div>
  );
}