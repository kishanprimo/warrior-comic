"use client";

import React, { useState } from "react";

type SignupValues = { alias: string; email: string; pass: string; confirmPass: string };
type SignupErrors = Partial<Record<keyof SignupValues | "terms", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const FACTIONS = ["Blade", "Shadow", "Titan", "Mystic"] as const;

const UserIcon = (
  <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
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
  id, label, type = "text", value, onChange, error, icon, autoComplete,
}: {
  id: string; label: string; type?: string; value: string;
  onChange: (v: string) => void; error?: string; icon: React.ReactNode; autoComplete?: string;
}) {
  return (
    <div>
      <div
        className={`group relative overflow-hidden rounded-xl border bg-black/40 backdrop-blur-md transition-all duration-300 focus-within:border-cyan-400 focus-within:shadow-[0_0_22px_-4px_rgba(103,232,249,0.6)] ${
          error ? "border-red-500/80" : "border-nav-right-line hover:border-nav-right-ring"
        }`}
      >
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-nav-right-text/60 transition-colors group-focus-within:text-cyan-300">
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
          className="peer w-full bg-transparent pb-2 pl-11 pr-4 pt-5 text-sm text-nav-right-heading outline-none placeholder-transparent"
        />
        <label
          htmlFor={id}
          className="pointer-events-none absolute left-11 top-2 text-[9px] uppercase tracking-[0.18em] text-nav-right-text/70 transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[9px] peer-focus:uppercase peer-focus:tracking-[0.18em] peer-focus:text-cyan-300"
        >
          {label}
        </label>
      </div>
      {error && <p className="mt-1 text-[11px] text-red-400">{error}</p>}
    </div>
  );
}

/** 0–4 password strength */
function strength(p: string) {
  let s = 0;
  if (p.length >= 6) s++;
  if (p.length >= 10) s++;
  if (/[a-z]/.test(p) && /[A-Z]/.test(p) && /\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
}
const STRENGTH_LABEL = ["Too weak", "Weak", "Fair", "Strong", "Legendary"];
const STRENGTH_COLOR = ["bg-red-500", "bg-red-500", "bg-orange-400", "bg-cyan-300", "bg-emerald-400"];

export default function Signup({ onSwitchToLogin }: { onSwitchToLogin?: () => void }) {
  const [values, setValues] = useState<SignupValues>({ alias: "", email: "", pass: "", confirmPass: "" });
  const [errors, setErrors] = useState<SignupErrors>({});
  const [faction, setFaction] = useState<(typeof FACTIONS)[number] | null>(null);
  const [terms, setTerms] = useState(false);
  const [shake, setShake] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const score = values.pass ? strength(values.pass) : 0;

  const handleChange = (field: keyof SignupValues, val: string) => {
    setValues((p) => ({ ...p, [field]: val }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const validate = () => {
    const errs: SignupErrors = {};
    if (values.alias.trim().length < 3) errs.alias = "Hero Alias must be at least 3 characters";
    if (!EMAIL_RE.test(values.email.trim())) errs.email = "Enter a valid email address";
    if (values.pass.length < 6) errs.pass = "Password must be at least 6 characters";
    if (values.pass !== values.confirmPass) errs.confirmPass = "Passwords do not match";
    if (!terms) errs.terms = "Accept the Warrior Code to continue";
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
    // TODO: replace with your real signup call (send values + faction)
    await new Promise((r) => setTimeout(r, 1300));
    setStatus("success");
  };

  /* ---------- success state ---------- */
  if (status === "success") {
    return (
      <div className="flex h-full min-h-[420px] w-full flex-col items-center justify-center p-8 text-center">
        <div className="ct-pop mb-5 flex h-20 w-20 items-center justify-center rounded-full border-2 border-cyan-400 bg-cyan-400/10 shadow-[0_0_40px_-5px_rgba(103,232,249,0.8)]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-9 w-9 text-cyan-300">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="font-serif text-2xl font-extrabold uppercase tracking-wide text-nav-right-heading">
          Legend Forged!
        </h3>
        <p className="mt-2 max-w-xs text-sm text-nav-right-text/80">
          Welcome to the WC-Universe, <span className="font-bold text-cyan-300">{values.alias.trim()}</span>
          {faction ? <> of the {faction} legion</> : null}. Check your inbox to confirm your email.
        </p>
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="mt-6 text-xs font-bold uppercase tracking-wider text-cyan-300 hover:underline"
        >
          Go to login
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col justify-between p-6 sm:p-10">
      <div>
        <div className="mb-6 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
            <span className="h-1.5 w-1.5 animate-ping rounded-full bg-cyan-300" />
            New Legionnaire
          </span>
          <span className="text-xs text-nav-right-text/70">Join the WC-Universe</span>
        </div>

        <h3 className="mb-2 font-serif text-2xl font-extrabold uppercase tracking-wide text-nav-right-heading sm:text-3xl">
          Forge Your Legend
        </h3>
        <p className="mb-6 text-xs leading-relaxed text-nav-right-text/80 sm:text-sm">
          Pick a hero alias and gain instant access to exclusive comic releases.
        </p>

        <form onSubmit={handleSubmit} noValidate className={`space-y-4 ${shake ? "ct-shake" : ""}`}>
          <Field
            id="signup-alias" label="Hero Alias / Username" autoComplete="username"
            value={values.alias} onChange={(v) => handleChange("alias", v)}
            error={errors.alias} icon={UserIcon}
          />
          <Field
            id="signup-email" label="Email Address" type="email" autoComplete="email"
            value={values.email} onChange={(v) => handleChange("email", v)}
            error={errors.email} icon={MailIcon}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Field
                id="signup-pass" label="Password" type="password" autoComplete="new-password"
                value={values.pass} onChange={(v) => handleChange("pass", v)}
                error={errors.pass} icon={LockIcon}
              />
              {values.pass && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((n) => (
                      <span
                        key={n}
                        className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                          score >= n ? STRENGTH_COLOR[score] : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-nav-right-text/70">
                    {STRENGTH_LABEL[score]}
                  </p>
                </div>
              )}
            </div>
            <Field
              id="signup-confirm" label="Confirm Pass" type="password" autoComplete="new-password"
              value={values.confirmPass} onChange={(v) => handleChange("confirmPass", v)}
              error={errors.confirmPass} icon={LockIcon}
            />
          </div>

          {/* Faction picker */}
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-nav-right-text/70">
              Choose your legion <span className="font-normal normal-case tracking-normal">(optional)</span>
            </p>
            <div className="grid grid-cols-4 gap-2">
              {FACTIONS.map((f) => (
                <button
                  key={f}
                  type="button"
                  aria-pressed={faction === f}
                  onClick={() => setFaction(faction === f ? null : f)}
                  className={`rounded-lg border py-2 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 active:scale-95 ${
                    faction === f
                      ? "border-cyan-300 bg-cyan-400/20 text-cyan-200 shadow-[0_0_16px_-2px_rgba(103,232,249,0.7)]"
                      : "border-nav-right-line bg-black/30 text-nav-right-text/80 hover:border-cyan-400/60 hover:text-cyan-200"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex cursor-pointer items-start gap-2 text-xs text-nav-right-text/80">
              <input
                type="checkbox"
                checked={terms}
                onChange={(e) => {
                  setTerms(e.target.checked);
                  if (errors.terms) setErrors((p) => ({ ...p, terms: undefined }));
                }}
                className="mt-0.5 rounded border-nav-right-line bg-black/40 text-cyan-400 focus:ring-cyan-400"
              />
              <span>I accept the Warrior Code (Terms &amp; Privacy Policy)</span>
            </label>
            {errors.terms && <p className="mt-1 text-[11px] text-red-400">{errors.terms}</p>}
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="group relative w-full overflow-hidden rounded-xl bg-cyan-400 py-3.5 font-serif text-xs font-extrabold uppercase tracking-[0.2em] text-black transition-all duration-300 hover:shadow-[0_0_30px_rgba(103,232,249,0.6)] active:scale-[0.98] disabled:opacity-60"
          >
            <span className="relative z-10">
              {status === "submitting" ? "Forging Account..." : "Join Warrior Comics"}
            </span>
            <span className="absolute inset-0 -translate-x-full bg-white/30 transition-transform duration-500 group-hover:translate-x-0" />
          </button>
        </form>
      </div>

      <div className="mt-6 border-t border-nav-right-line/40 pt-5 text-center">
        <p className="text-xs text-nav-right-text/70">
          Already part of the universe?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-bold uppercase tracking-wider text-cyan-300 hover:underline focus:outline-none"
          >
            Sign In Here
          </button>
        </p>
      </div>
    </div>
  );
}