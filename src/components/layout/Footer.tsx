import { Link } from "react-router-dom";
import { Github } from "lucide-react";
import { useTranslation } from "react-i18next";
import Logo from "../Logo";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border/40 bg-background-dark mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <Logo />
            </Link>
            <p className="text-muted-foreground text-sm max-w-md">
              {t("footer.description")}
            </p>
            <div className="flex items-center space-x-4 mt-4">
              <a
                href="https://github.com/arthurhenriquelopes/distrowiki"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary smooth-transition"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">{t("footer.navigation")}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary smooth-transition">
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link to="/catalogo" className="text-sm text-muted-foreground hover:text-primary smooth-transition">
                  {t("nav.catalog")}
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="text-sm text-muted-foreground hover:text-primary smooth-transition">
                  {t("nav.about")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">{t("footer.resources")}</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://github.com/arthurhenriquelopes/distrowiki" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary smooth-transition">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary smooth-transition">
                  {t("footer.contribute")}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary smooth-transition">
                  {t("footer.license")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            {t("footer.copyright", { year: currentYear })}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

