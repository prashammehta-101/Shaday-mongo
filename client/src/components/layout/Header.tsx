import { Moon, Search, Shield, ShoppingBag, Store, Sun, User2 } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface HeaderProps {
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-4 py-3 text-sm font-bold uppercase tracking-[0.18em] transition ${
    isActive
      ? "border-[3px] border-[var(--border)] bg-[var(--accent)] text-[var(--text-main)] shadow-[4px_4px_0_var(--border)]"
      : "border-[3px] border-transparent text-[var(--text-soft)] hover:border-[var(--border)] hover:bg-[var(--surface-soft)]"
  }`;

export const Header = ({ theme, onToggleTheme }: HeaderProps) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 mt-4 flex w-full items-center justify-between border-[3px] border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-[10px_10px_0_var(--border)]">
      <Link to="/home" className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center border-[3px] border-[var(--border)] bg-[var(--accent)] font-serif text-2xl leading-none shadow-[4px_4px_0_var(--border)]">
          S
        </div>
        <div>
          <div className="font-serif text-3xl leading-none">SHADAY</div>
          <div className="text-[10px] uppercase tracking-[0.4em] text-[var(--text-soft)]">
            Mens Shirt Atelier
          </div>
        </div>
      </Link>

      <nav className="hidden items-center gap-2 md:flex">
        <NavLink to="/home" className={navLinkClass}>
          Home
        </NavLink>
        <NavLink to="/catalog" className={navLinkClass}>
          Catalog
        </NavLink>
        <NavLink to="/wishlist" className={navLinkClass}>
          Wishlist
        </NavLink>
        <NavLink to="/cart" className={navLinkClass}>
          Cart
        </NavLink>
        <NavLink to="/orders" className={navLinkClass}>
          Orders
        </NavLink>
        {user && (
          <NavLink to="/dashboard" className={navLinkClass}>
            Dashboard
          </NavLink>
        )}
      </nav>

      <div className="flex items-center gap-2">
        <button type="button" onClick={onToggleTheme} className="grid h-11 w-11 place-items-center border-[3px] border-[var(--border)] bg-[var(--surface-soft)] shadow-[4px_4px_0_var(--border)]">
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <Link to="/catalog" className="grid h-11 w-11 place-items-center border-[3px] border-[var(--border)] bg-[var(--surface-soft)] shadow-[4px_4px_0_var(--border)]">
          <Search size={18} />
        </Link>
        {user?.role === "ADMIN" && (
          <Link to="/dashboard" className="grid h-11 w-11 place-items-center border-[3px] border-[var(--border)] bg-[var(--surface-soft)] shadow-[4px_4px_0_var(--border)]">
            <Shield size={18} />
          </Link>
        )}
        {user?.role === "SELLER" && (
          <Link to="/dashboard" className="grid h-11 w-11 place-items-center border-[3px] border-[var(--border)] bg-[var(--surface-soft)] shadow-[4px_4px_0_var(--border)]">
            <Store size={18} />
          </Link>
        )}
        <Link to="/cart" className="grid h-11 w-11 place-items-center border-[3px] border-[var(--border)] bg-[var(--surface-soft)] shadow-[4px_4px_0_var(--border)]">
          <ShoppingBag size={18} />
        </Link>
        {user ? (
          <Link
            to="/account"
            className="border-[3px] border-[var(--border)] bg-[var(--accent)] px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] shadow-[4px_4px_0_var(--border)]"
          >
            {user.name.split(" ")[0]}
          </Link>
        ) : (
          <Link to="/login" className="grid h-11 w-11 place-items-center border-[3px] border-[var(--border)] bg-[var(--surface-soft)] shadow-[4px_4px_0_var(--border)]">
            <User2 size={18} />
          </Link>
        )}
      </div>
    </header>
  );
};
