import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { SEO } from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <SEO
        title="Página Não Encontrada - 404"
        description="A página que você procura não existe. Volte para a página inicial e explore o catálogo de distribuições Linux."
        canonical={`https://distrowiki.site${location.pathname}`}
      />
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      
      <motion.div 
        className="text-center px-4 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative flex items-center justify-center mb-8 h-[300px]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
          <motion.h1 
            className="text-[140px] md:text-[180px] font-bold gradient-text absolute z-0 leading-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            404
          </motion.h1>
          
          <motion.img 
            src="/404/tux404.svg" 
            alt="Tux perdido - Erro 404" 
            className="w-[358px] h-[358px] relative z-10"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </div>

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("notFound.title")}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {t("notFound.description")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link to="/">
            <Button 
              size="lg" 
              variant="ghost"
              className="text-base font-medium text-foreground hover:text-primary hover:bg-transparent border-b-2 border-foreground hover:border-primary rounded-none px-6 smooth-transition"
            >
              <Home className="mr-2 h-5 w-5" />
              {t("notFound.backHome")}
            </Button>
          </Link>
        </motion.div>

        <motion.p
          className="text-sm text-muted-foreground pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {t("notFound.pathAttempted")} <code className="bg-muted px-2 py-1 rounded">{location.pathname}</code>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default NotFound;
