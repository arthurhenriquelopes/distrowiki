import { Link } from "react-router-dom";
import { Github } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-background-dark mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <span className="text-xl font-bold text-primary-foreground">DW</span>
              </div>
              <span className="text-xl font-bold gradient-text">DistroWiki</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md">
              Plataforma open source para comparação objetiva e transparente de distribuições Linux focadas em desktop.
            </p>
            <div className="flex items-center space-x-4 mt-4">
              <a
                href="https://github.com"
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
            <h3 className="text-sm font-semibold text-foreground mb-4">Navegação</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary smooth-transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/catalogo" className="text-sm text-muted-foreground hover:text-primary smooth-transition">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="text-sm text-muted-foreground hover:text-primary smooth-transition">
                  Sobre
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Recursos</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary smooth-transition">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary smooth-transition">
                  Contribuir
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary smooth-transition">
                  Licença MIT
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/40 mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} DistroWiki. Projeto open source sob licença MIT.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
