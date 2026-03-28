import { ArrowRight, BadgeIndianRupee, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="editorial-shell overflow-hidden p-8 md:p-12">
        <div className="mb-6 inline-flex items-center gap-2 brutal-label">
          <Sparkles size={14} />
          Factory-crafted premium shirts
        </div>
        <h1 className="max-w-4xl font-serif text-6xl leading-[0.88] md:text-8xl">
          BRUTAL SHIRTS.
          <br />
          CLEAN FITS.
          <br />
          DIRECT BUYING.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--text-soft)] md:text-lg">
          SHADAY now feels louder, sharper, and more direct. Browse the collection, filter fast, and move straight into product pages, COD orders, and account actions.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link to="/catalog" className="accent-button inline-flex items-center gap-2 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] transition hover:translate-y-[-1px]">
            Explore Collection
            <ArrowRight size={16} />
          </Link>
          <Link to="/dashboard" className="inline-flex items-center gap-2 border-[3px] border-[var(--border)] bg-[var(--surface-soft)] px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] shadow-[6px_6px_0_var(--border)]">
            Open Control Center
          </Link>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="border-[3px] border-[var(--border)] bg-[var(--surface-soft)] p-4 shadow-[6px_6px_0_var(--border)]">
            <ShieldCheck className="mb-3 text-[var(--accent-deep)]" />
            <div className="text-sm uppercase tracking-[0.18em] text-[var(--text-soft)]">Production-ready roles</div>
            <div className="mt-1 font-serif text-3xl">Admin / Seller / Customer</div>
          </div>
          <div className="border-[3px] border-[var(--border)] bg-[var(--surface-soft)] p-4 shadow-[6px_6px_0_var(--border)]">
            <BadgeIndianRupee className="mb-3 text-[var(--accent-deep)]" />
            <div className="text-sm uppercase tracking-[0.18em] text-[var(--text-soft)]">Payment flow</div>
            <div className="mt-1 font-serif text-3xl">Cash on Delivery</div>
          </div>
          <div className="border-[3px] border-[var(--border)] bg-[var(--surface-soft)] p-4 shadow-[6px_6px_0_var(--border)]">
            <Sparkles className="mb-3 text-[var(--accent-deep)]" />
            <div className="text-sm uppercase tracking-[0.18em] text-[var(--text-soft)]">Catalog experience</div>
            <div className="mt-1 font-serif text-3xl">Curated styles and filters</div>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden border-[3px] border-[var(--border)] bg-[var(--surface-strong)] p-4 shadow-[12px_12px_0_var(--border)]">
        <img
          src="https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=1200&q=80"
          alt="SHADAY premium shirt"
          className="relative h-full min-h-[520px] w-full border-[3px] border-[var(--border)] object-cover"
        />
        <div className="absolute bottom-6 left-6 right-6 border-[3px] border-[var(--border)] bg-[var(--accent)] p-5 text-[var(--text-main)] shadow-[8px_8px_0_var(--border)]">
          <div className="text-xs font-bold uppercase tracking-[0.22em]">Featured Capsule</div>
          <div className="mt-2 font-serif text-4xl">The Signature Shirt Edit</div>
          <p className="mt-2 text-sm leading-6 text-[var(--text-main)]/80">
            Big images, sharp filters, and a storefront that looks closer to a statement poster than a soft fashion card.
          </p>
        </div>
      </div>
    </section>
  );
};
