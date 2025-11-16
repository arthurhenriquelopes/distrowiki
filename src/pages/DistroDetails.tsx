import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Download, Loader2 } from "lucide-react";
import ScoreBadge from "@/components/ScoreBadge";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DistroDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [distro, setDistro] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDistro = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/distros/${id}`);
        
        if (!response.ok) {
          throw new Error(`Distribuição não encontrada`);
        }
        
        const data = await response.json();
        setDistro(data);
      } catch (err: any) {
        console.error('Erro ao buscar distro:', err);
        setError(err.message || 'Erro ao carregar distribuição');
      } finally {
        setLoading(false);
      }
    };

    fetchDistro();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Carregando distribuição...</p>
        </div>
      </div>
    );
  }

  if (error || !distro) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen">
        <Link to="/catalogo">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Catálogo
          </Button>
        </Link>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Distribuição não encontrada</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Link to="/catalogo">
            <Button>Ir para o Catálogo</Button>
          </Link>
        </div>
      </div>
    );
  }

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
            src={`/logos/${distro.id}.svg`}
            alt={`${distro.name} logo`}
            className="w-32 h-32 object-contain"
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(distro.name)}&background=random&size=128`;
            }}
          />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{distro.name}</h1>
            <p className="text-xl text-muted-foreground mb-4">{distro.family || 'Independente'}</p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <ScoreBadge score={distro.rating || 0} size="lg" />
              {distro.homepage && (
                <a href={distro.homepage} target="_blank" rel="noopener noreferrer">
                  <Button className="gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Site Oficial
                  </Button>
                </a>
              )}
              <Link to="/comparacao">
                <Button variant="outline">Comparar com outra</Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="specs">Especificações</TabsTrigger>
          <TabsTrigger value="links">Links Úteis</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-6 animate-fade-in">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Sobre {distro.name}</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {distro.summary || distro.description || 'Sem descrição disponível'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Família/Base</p>
                <p className="font-medium">{distro.family || 'Independente'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Origem</p>
                <p className="font-medium">{distro.origin || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <p className="font-medium">{distro.status || 'N/A'}</p>
              </div>
            </div>
          </div>

          {distro.desktop_environments && distro.desktop_environments.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4">Ambientes Gráficos Disponíveis</h3>
              <div className="flex flex-wrap gap-2">
                {distro.desktop_environments.map((de: string) => (
                  <Badge key={de} variant="secondary" className="text-sm px-3 py-1">
                    {de}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Specs */}
        <TabsContent value="specs" className="space-y-6 animate-fade-in">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Especificações Técnicas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Baseado em</p>
                  <p className="text-lg font-medium">{distro.based_on || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Categoria</p>
                  <p className="text-lg font-medium">{distro.category || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Arquitetura</p>
                  <p className="text-lg font-medium">{distro.architecture || 'N/A'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">OS Type</p>
                  <p className="text-lg font-medium">{distro.os_type || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Ranking DistroWatch</p>
                  <p className="text-lg font-medium">{distro.ranking || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Rating</p>
                  <p className="text-lg font-medium">{distro.rating?.toFixed(1) || '0'} / 10</p>
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
              {distro.homepage && (
                <a
                  href={distro.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 smooth-transition group"
                >
                  <span className="font-medium">Site Oficial</span>
                  <ExternalLink className="w-5 h-5 text-primary group-hover:translate-x-1 smooth-transition" />
                </a>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DistroDetails;
