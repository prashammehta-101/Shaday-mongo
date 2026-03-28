import { MapPin, LogOut, Mail, Phone, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const AccountPage = () => {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
      <section className="editorial-shell p-8 md:p-10">
        <div className="text-xs uppercase tracking-[0.34em] text-[var(--accent-deep)]">My Account</div>
        <h1 className="mt-3 font-serif text-5xl">Your SHADAY details</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-soft)]">
          Manage your personal information stored for your account.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-soft)] p-5">
            <div className="text-xs uppercase tracking-[0.28em] text-[var(--accent-deep)]">Full name</div>
            <div className="mt-2 font-serif text-3xl">{user.name}</div>
          </div>
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-soft)] p-5">
            <div className="text-xs uppercase tracking-[0.28em] text-[var(--accent-deep)]">Role</div>
            <div className="mt-2 inline-flex items-center gap-2 font-serif text-3xl">
              <Shield size={22} />{user.role}
            </div>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex items-center gap-3 text-[var(--text-soft)]"><Mail size={18} />Email</div>
            <div className="mt-3 text-lg">{user.email}</div>
          </div>
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex items-center gap-3 text-[var(--text-soft)]"><Phone size={18} />Phone</div>
            <div className="mt-3 text-lg">{user.phone || "Not added yet"}</div>
          </div>
        </div>
      </section>

      <section className="editorial-shell p-8 md:p-10">
        <div className="text-xs uppercase tracking-[0.34em] text-[var(--accent-deep)]">Saved Addresses</div>
        <div className="mt-6 space-y-4">
          {(user.addresses || []).map((address, idx) => (
            <article key={address.id || idx} className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-soft)] p-5">
              <div className="flex items-center gap-3 text-[var(--text-soft)]">
                <MapPin size={18} />{address.label}
                {address.isPrimary && <span className="ml-auto text-xs uppercase tracking-widest text-[var(--accent-deep)]">Primary</span>}
              </div>
              <div className="mt-3 text-sm leading-7">
                {address.line1}{address.line2 ? `, ${address.line2}` : ""}<br />
                {address.city}, {address.state}, {address.country} — {address.postalCode}
              </div>
            </article>
          ))}
          {(!user.addresses || user.addresses.length === 0) && (
            <div className="rounded-[1.5rem] border border-dashed border-[var(--border)] p-5 text-sm text-[var(--text-soft)]">
              No saved addresses yet.
            </div>
          )}
        </div>
        <button type="button" onClick={logout} className="mt-8 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-6 py-3 text-sm font-medium text-white">
          <LogOut size={16} />Logout
        </button>
      </section>
    </div>
  );
};
