import type { Role } from "../lib/types";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const LoginPage = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", role: "CUSTOMER" as Role });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [verificationLink, setVerificationLink] = useState("");

  const verificationPath = verificationLink
    ? (() => { try { const p = new URL(verificationLink); return `${p.pathname}${p.search}`; } catch { return verificationLink; } })()
    : "";

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(""); setSuccess(""); setVerificationLink("");
    try {
      if (mode === "login") {
        await login(form.email, form.password);
        navigate(location.state?.from || "/home");
        return;
      }
      const data = await signup(form);
      setMode("login");
      setForm({ name: "", email: form.email, password: "", phone: "", role: "CUSTOMER" });
      setSuccess(data.message);
      setVerificationLink(data.verificationLink);
    } catch (err: unknown) {
      const msg =
        typeof err === "object" && err !== null && "response" in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === "string"
          ? (err as { response: { data: { message: string } } }).response.data.message
          : "Unable to continue. Please check your details.";
      setError(msg);
    }
  };

  return (
    <section className="grid min-h-[calc(100vh-4rem)] gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:items-center">
      <div className="editorial-shell relative overflow-hidden p-8 md:p-12">
        <div className="absolute inset-y-0 right-[18%] w-px bg-[var(--border)]" />
        <div className="text-xs uppercase tracking-[0.42em] text-[var(--accent-deep)]">SHADAY</div>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <div className="text-xs uppercase tracking-[0.34em] text-[var(--text-soft)]">Mens Shirt Atelier</div>
            <h1 className="mt-4 max-w-2xl font-serif text-5xl leading-[0.9] md:text-7xl">
              Raw, bold, and functional. A brutalist SHADAY storefront.
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-7 text-[var(--text-soft)] md:text-base">
              Strong blocks, direct navigation, product-heavy browsing, and a full-stack backend with MongoDB.
            </p>
          </div>
          <div className="rounded-[1.75rem] bg-[var(--surface-strong)] p-6 text-white">
            <div className="text-xs uppercase tracking-[0.3em] text-white/55">Inside</div>
            <div className="mt-4 space-y-4">
              <div><div className="font-serif text-3xl">6+</div><div className="text-sm text-white/65">premium shirt designs</div></div>
              <div><div className="font-serif text-3xl">3</div><div className="text-sm text-white/65">roles with separate flows</div></div>
              <div><div className="font-serif text-3xl">COD</div><div className="text-sm text-white/65">checkout and order tracking</div></div>
            </div>
          </div>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-soft)] p-4">
            <div className="text-xs uppercase tracking-[0.28em] text-[var(--accent-deep)]">Designs</div>
            <div className="mt-2 font-serif text-2xl">Formal to resort edits</div>
          </div>
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-soft)] p-4">
            <div className="text-xs uppercase tracking-[0.28em] text-[var(--accent-deep)]">Options</div>
            <div className="mt-2 font-serif text-2xl">Color, fit, sleeve, price</div>
          </div>
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-soft)] p-4">
            <div className="text-xs uppercase tracking-[0.28em] text-[var(--accent-deep)]">Access</div>
            <div className="mt-2 font-serif text-2xl">Customer, seller, admin</div>
          </div>
        </div>
      </div>

      <div className="editorial-shell p-8 md:p-10">
        <div className="text-xs uppercase tracking-[0.34em] text-[var(--text-soft)]">Account access</div>
        <h2 className="mt-3 font-serif text-4xl text-[var(--text-main)]">
          {mode === "login" ? "Welcome back" : "Create your SHADAY account"}
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--text-soft)]">
          Password must have 8+ chars, 1 capital, 1 special symbol, and 3+ numbers.
        </p>

        <div className="mt-6 inline-flex rounded-full border border-[var(--border)] bg-[var(--surface-soft)] p-1">
          <button type="button" onClick={() => setMode("login")} className={`rounded-full px-5 py-2 text-sm transition ${mode === "login" ? "accent-button" : "text-[var(--text-soft)]"}`}>Login</button>
          <button type="button" onClick={() => setMode("signup")} className={`rounded-full px-5 py-2 text-sm transition ${mode === "signup" ? "accent-button" : "text-[var(--text-soft)]"}`}>Sign up</button>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          {mode === "signup" && (
            <>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" className="field" />
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone number (10-digit)" className="field" />
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })} className="field">
                <option value="CUSTOMER">Customer</option>
                <option value="SELLER">Seller</option>
              </select>
            </>
          )}
          <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email address" className="field" />
          <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" className="field" />
          {success && <div className="text-sm text-emerald-600">{success}</div>}
          {verificationLink && (
            <Link to={verificationPath} className="block text-sm font-medium underline underline-offset-4">
              ✅ Click here to verify your email
            </Link>
          )}
          {error && <div className="text-sm text-rose-500">{error}</div>}
          <button type="submit" className="accent-button w-full rounded-full px-6 py-3 text-sm font-medium transition">
            {mode === "login" ? "Login to SHADAY" : "Create account"}
          </button>
        </form>
      </div>
    </section>
  );
};
