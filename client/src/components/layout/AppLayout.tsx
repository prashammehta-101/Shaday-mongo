import { useEffect, useState, type PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "./Header";

export const AppLayout = ({ children }: PropsWithChildren) => {
  const location = useLocation();
  const [theme, setTheme] = useState<"dark" | "light">(
    (localStorage.getItem("shaday-theme") as "dark" | "light") || "dark"
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("shaday-theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen pb-12">
      {location.pathname !== "/login" ? (
        <Header theme={theme} onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")} />
      ) : null}
      <main className={`page-shell ${location.pathname !== "/login" ? "mt-8" : "pt-8 md:pt-14"}`}>
        {children}
      </main>
    </div>
  );
};
