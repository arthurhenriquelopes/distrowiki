import { Link, useLocation } from "react-router-dom";
import { Menu, X, Github } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import Logo from "../Logo";
import { ThemeToggle } from "../theme-toggle";
import { LanguageSwitcher } from "./LanguageSwitcher";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  const navLinks = [
    { path: "/", label: t("nav.home") },
    { path: "/catalogo", label: t("nav.catalog") },
    { path: "/sobre", label: t("nav.about") },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="smooth-transition hover:opacity-80">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium smooth-transition ${
                isActive(link.path)
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://github.com/arthurhenriquelopes/distrowiki"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground smooth-transition"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5" />
          </a>
          <LanguageSwitcher />
          <ThemeToggle />
        </nav>

        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur animate-fade-in">
          <nav className="container mx-auto flex flex-col space-y-4 px-4 py-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-medium smooth-transition ${
                  isActive(link.path)
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://github.com/arthurhenriquelopes/distrowiki"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-base font-medium text-muted-foreground hover:text-foreground smooth-transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Github className="h-5 w-5" />
              <span>GitHub</span>
            </a>
            <div className="flex items-center gap-2 pt-2">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

