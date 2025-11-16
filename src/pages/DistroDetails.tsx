import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getDistroById, distros } from "@/data/distros";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Download } from "lucide-react";
import ScoreBadge from "@/components/ScoreBadge";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DistroCard from "@/components/DistroCard";

const DistroDetails = () => {
  const { id } = useParams<{ id: string }>();
  const distro = id ? getDistroById(id) : undefined;

  if (!distro) {
    return <Navigate to="/catalogo" replace />;
  }

  const similarDistros = distros
    .filter((d) => d.id !== distro.id && (d.family === distro.family || Math.abs(d.score - distro.score) < 0.5))
    .slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link to="/catalogo">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Catálogo
          </Button>
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div 
        className="bg-card border border-border rounded-xl p-8 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <img
            src={distro.logo}
            alt={`${distro.name} logo`}
            className="w-32 h-32 object-contain"
          />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{distro.name}</h1>
            <p className="text-xl text-muted-foreground mb-4">{distro.family}</p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <ScoreBadge score={distro.score} size="lg" />
              <a href={distro.website} target="_blank" rel="noopener noreferrer">
                <Button className="gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Site Oficial
                </Button>
              </a>
              <Link to="/comparacao">
                <Button variant="outline">Comparar com outra</Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
          <TabsTrigger value="specs">Especificações</TabsTrigger>
          <TabsTrigger value="links">Links Úteis</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-6 animate-fade-in">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Sobre {distro.name}</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {distro.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Família/Base</p>
                <p className="font-medium">{distro.family}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Último Lançamento</p>
                <p className="font-medium">
                  {new Date(distro.lastRelease).toLocaleDateString("pt-BR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4">Ambientes Gráficos Disponíveis</h3>
            <div className="flex flex-wrap gap-2">
              {distro.desktopEnvironments.map((de) => (
                <Badge key={de} variant="secondary" className="text-sm px-3 py-1">
                  {de}
                </Badge>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Metrics */}
        <TabsContent value="metrics" className="space-y-6 animate-fade-in">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Métricas de Desempenho</h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold">Uso de RAM (Idle)</h3>
                  <span className="text-2xl font-bold text-primary">{distro.ramIdle} MB</span>
                </div>
                <div className="w-full bg-muted rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-primary to-primary-hover rounded-full h-4 smooth-transition"
                    style={{ width: `${(distro.ramIdle / 2000) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Quanto menor, melhor. Medido em sistema novo sem aplicativos abertos.
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold">CPU Performance</h3>
                  <span className="text-2xl font-bold text-primary">{distro.cpuScore}/100</span>
                </div>
                <div className="w-full bg-muted rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-primary to-primary-hover rounded-full h-4 smooth-transition"
                    style={{ width: `${distro.cpuScore}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Score baseado em benchmarks de tarefas comuns de desktop.
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold">I/O Performance</h3>
                  <span className="text-2xl font-bold text-primary">{distro.ioScore}/100</span>
                </div>
                <div className="w-full bg-muted rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-primary to-primary-hover rounded-full h-4 smooth-transition"
                    style={{ width: `${distro.ioScore}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Velocidade de leitura/escrita em disco e resposta do sistema.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Specs */}
        <TabsContent value="specs" className="space-y-6 animate-fade-in">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Especificações Técnicas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Gerenciador de Pacotes</p>
                  <p className="text-lg font-medium">{distro.packageManager}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Modelo de Lançamento</p>
                  <p className="text-lg font-medium">{distro.releaseModel}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Suporte LTS</p>
                  <p className={`text-lg font-medium ${distro.ltsSupport ? "text-success" : ""}`}>
                    {distro.ltsSupport ? "Disponível" : "Não disponível"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">RAM Mínima</p>
                  <p className="text-lg font-medium">{distro.minRam / 1024} GB</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Armazenamento Mínimo</p>
                  <p className="text-lg font-medium">{distro.minStorage} GB</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Arquiteturas</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {distro.architectures.map((arch) => (
                      <Badge key={arch} variant="outline">
                        {arch}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Links */}
        <TabsContent value="links" className="space-y-6 animate-fade-in">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Links Úteis</h2>
            
            <div className="space-y-3">
              <a
                href={distro.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 smooth-transition group"
              >
                <span className="font-medium">Site Oficial</span>
                <ExternalLink className="w-5 h-5 text-primary group-hover:translate-x-1 smooth-transition" />
              </a>
              <a
                href={`${distro.website}/download`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 smooth-transition group"
              >
                <span className="font-medium">Download</span>
                <Download className="w-5 h-5 text-primary group-hover:translate-y-1 smooth-transition" />
              </a>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Similar Distros */}
      {similarDistros.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Distribuições Similares</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarDistros.map((d) => (
              <DistroCard key={d.id} distro={d} showCheckbox={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DistroDetails;
