import { useComparison } from "@/contexts/ComparisonContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, X } from "lucide-react";
import ScoreBadge from "@/components/ScoreBadge";
import { Badge } from "@/components/ui/badge";

const Comparison = () => {
  const { selectedDistros, removeDistro } = useComparison();

  if (selectedDistros.length < 2) {
    return (
      <div className="container mx-auto px-4 py-20 min-h-screen">
        <div className="text-center space-y-6 max-w-2xl mx-auto animate-fade-in">
          <h1 className="text-4xl font-bold">Nenhuma Distro Selecionada</h1>
          <p className="text-lg text-muted-foreground">
            Selecione pelo menos 2 distribuições no catálogo para comparar.
          </p>
          <Link to="/catalogo">
            <Button size="lg">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Ir para o Catálogo
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getBestValue = (key: keyof typeof selectedDistros[0], reverse = false) => {
    const values = selectedDistros.map((d) => d[key] as number);
    return reverse ? Math.min(...values) : Math.max(...values);
  };

  const isBest = (value: number, bestValue: number) => value === bestValue;

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link to="/catalogo">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Catálogo
          </Button>
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold mb-2">Comparação de Distros</h1>
        <p className="text-muted-foreground">
          Comparando {selectedDistros.length} distribuições lado a lado
        </p>
      </motion.div>

      {/* Comparison Grid */}
      <div className="overflow-x-auto">
        <motion.div 
          className="grid gap-6" 
          style={{ gridTemplateColumns: `repeat(${selectedDistros.length}, minmax(280px, 1fr))` }}
          initial="initial"
          animate="animate"
          variants={{
            animate: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {selectedDistros.map((distro) => (
            <motion.div 
              key={distro.id} 
              className="bg-card border border-border rounded-xl overflow-hidden"
              variants={{
                initial: { opacity: 0, scale: 0.9 },
                animate: { opacity: 1, scale: 1 }
              }}
            >
              {/* Header */}
              <div className="p-6 border-b border-border relative">
                <button
                  onClick={() => removeDistro(distro.id)}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-destructive smooth-transition"
                  aria-label="Remover"
                >
                  <X className="w-5 h-5" />
                </button>
                <img
                  src={distro.logo}
                  alt={`${distro.name} logo`}
                  className="w-20 h-20 object-contain mx-auto mb-4"
                />
                <h2 className="text-2xl font-bold text-center mb-2">{distro.name}</h2>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  {distro.family}
                </p>
                <div className="flex justify-center">
                  <ScoreBadge score={distro.score} size="lg" />
                </div>
              </div>

              {/* Info Sections */}
              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
                    Informações Básicas
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Site Oficial</p>
                      <a
                        href={distro.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                      >
                        Visitar <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Último Lançamento</p>
                      <p className="text-sm">
                        {new Date(distro.lastRelease).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Desktop Environments */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
                    Ambientes Gráficos
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {distro.desktopEnvironments.map((de) => (
                      <Badge key={de} variant="secondary" className="text-xs">
                        {de}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Performance */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
                    Desempenho
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs text-muted-foreground">RAM Idle</p>
                        <p
                          className={`text-sm font-semibold ${
                            isBest(distro.ramIdle, getBestValue("ramIdle", true))
                              ? "text-success"
                              : ""
                          }`}
                        >
                          {distro.ramIdle} MB
                        </p>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary rounded-full h-2 smooth-transition"
                          style={{ width: `${(distro.ramIdle / 2000) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs text-muted-foreground">CPU Score</p>
                        <p
                          className={`text-sm font-semibold ${
                            isBest(distro.cpuScore, getBestValue("cpuScore"))
                              ? "text-success"
                              : ""
                          }`}
                        >
                          {distro.cpuScore}
                        </p>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary rounded-full h-2 smooth-transition"
                          style={{ width: `${distro.cpuScore}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs text-muted-foreground">I/O Score</p>
                        <p
                          className={`text-sm font-semibold ${
                            isBest(distro.ioScore, getBestValue("ioScore"))
                              ? "text-success"
                              : ""
                          }`}
                        >
                          {distro.ioScore}
                        </p>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary rounded-full h-2 smooth-transition"
                          style={{ width: `${distro.ioScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical Details */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
                    Detalhes Técnicos
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gerenciador</span>
                      <span className="font-medium">{distro.packageManager}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Modelo</span>
                      <span className="font-medium">{distro.releaseModel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">LTS</span>
                      <span className={distro.ltsSupport ? "text-success" : "text-muted-foreground"}>
                        {distro.ltsSupport ? "Sim" : "Não"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <Link to={`/distro/${distro.id}`}>
                  <Button variant="outline" className="w-full">
                    Ver Detalhes Completos
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Comparison;
