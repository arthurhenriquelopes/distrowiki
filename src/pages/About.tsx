import { motion } from "framer-motion";
import { Shield, TrendingUp, Target, Code, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const About = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      {/* Hero */}
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Sobre o DistroWiki</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Comparação objetiva e transparente de distribuições Linux para desktop
        </p>
      </motion.div>

      {/* Mission */}
      <motion.section 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-card border border-border rounded-xl p-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Nossa Missão</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            O DistroWiki nasceu da necessidade de tornar a escolha de uma distribuição Linux mais 
            simples e baseada em dados reais. Queremos democratizar o acesso a informações técnicas 
            de forma clara e em português, sem viés comercial ou marketing.
          </p>
        </div>
      </motion.section>

      {/* Why Useful */}
      <section className="mb-16">
        <motion.h2 
          className="text-3xl font-bold text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Por que isso é útil?
        </motion.h2>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
        >
          {[
            {
              icon: Target,
              title: "Decisões Informadas",
              description: "Compare métricas reais em vez de opiniões subjetivas ou marketing.",
            },
            {
              icon: Shield,
              title: "Transparência Total",
              description: "Metodologia aberta, dados verificáveis e sem conflito de interesses.",
            },
            {
              icon: TrendingUp,
              title: "Economia de Tempo",
              description: "Evite testar dezenas de distros. Encontre a ideal mais rapidamente.",
            },
            {
              icon: Code,
              title: "Foco em Desktop",
              description: "Especializado em uso desktop, não servidores ou embarcados.",
            },
            {
              icon: Users,
              title: "Comunidade PT-BR",
              description: "Conteúdo em português acessível para toda comunidade brasileira.",
            },
            {
              icon: Heart,
              title: "100% Gratuito",
              description: "Projeto open source sem paywall, anúncios ou assinaturas.",
            },
          ].map((item) => (
            <motion.div key={item.title} variants={fadeIn}>
              <div className="bg-card border border-border rounded-xl p-6 card-hover">
                <item.icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Methodology */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">Metodologia de Pontuação</h2>
        
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3 text-primary">O que medimos</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">1. Atributos Informativos</h4>
                <p className="text-sm text-muted-foreground">
                  Base/família, ambientes gráficos disponíveis, data de lançamento, gerenciador de pacotes, 
                  modelo de release (rolling/fixed), suporte LTS.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">2. Indicadores Práticos</h4>
                <p className="text-sm text-muted-foreground">
                  Uso de RAM em idle, benchmarks de CPU e I/O, requisitos mínimos de hardware, 
                  qualidade da documentação, tamanho da comunidade.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">3. Visão Consolidada (Score)</h4>
                <p className="text-sm text-muted-foreground">
                  Pontuação de 0-10 baseada em desempenho, estabilidade, facilidade de uso, 
                  suporte da comunidade e atualização de pacotes. Pesos ajustados para uso desktop.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3 text-primary">Como pontuamos</h3>
            <p className="text-sm text-muted-foreground mb-4">
              O score geral é calculado considerando múltiplos fatores:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span><strong>Desempenho (30%):</strong> RAM idle, CPU e I/O benchmarks</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span><strong>Estabilidade (25%):</strong> Frequência de bugs críticos, suporte LTS</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span><strong>Usabilidade (20%):</strong> Facilidade de instalação e configuração</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span><strong>Comunidade (15%):</strong> Tamanho, atividade e qualidade do suporte</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span><strong>Atualização (10%):</strong> Frequência de updates e versões de pacotes</span>
              </li>
            </ul>
          </div>

          <div className="bg-warning/10 border border-warning/20 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-3 text-warning">Limitações e Transparência</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <span className="text-warning mr-2">⚠</span>
                <span>Benchmarks são executados em hardware padronizado, resultados podem variar no seu sistema.</span>
              </li>
              <li className="flex items-start">
                <span className="text-warning mr-2">⚠</span>
                <span>Escopo focado em <strong>uso desktop</strong>. Não cobrimos servidores ou sistemas embarcados.</span>
              </li>
              <li className="flex items-start">
                <span className="text-warning mr-2">⚠</span>
                <span>Pontuações são atualizadas periodicamente, mas não refletem mudanças em tempo real.</span>
              </li>
              <li className="flex items-start">
                <span className="text-warning mr-2">⚠</span>
                <span>A "melhor distro" depende do seu caso de uso específico. Use nossos filtros!</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">Roadmap Público</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            { status: "✓", text: "Catálogo com 12+ distros populares", done: true },
            { status: "✓", text: "Sistema de comparação lado a lado", done: true },
            { status: "✓", text: "Filtros por família e ambiente gráfico", done: true },
            { status: "⏳", text: "Sistema de busca avançada", done: false },
            { status: "⏳", text: "Gráficos de evolução histórica de scores", done: false },
            { status: "⏳", text: "Exportação de comparações em PDF", done: false },
            { status: "⏳", text: "API pública para desenvolvedores", done: false },
            { status: "⏳", text: "Sistema de contribuição comunitária", done: false },
          ].map((item, index) => (
            <div
              key={index}
              className={`flex items-center space-x-4 p-4 rounded-lg ${
                item.done
                  ? "bg-success/10 border border-success/20"
                  : "bg-card border border-border"
              } animate-slide-up`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className={`text-2xl ${item.done ? "text-success" : "text-muted-foreground"}`}>
                {item.status}
              </span>
              <span className={item.done ? "text-foreground font-medium" : "text-muted-foreground"}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Contribute */}
      <section className="mb-16">
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-2xl p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Como Contribuir</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            O DistroWiki é um projeto open source e depende da comunidade para crescer e melhorar.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-background/50 backdrop-blur rounded-xl p-4">
              <h3 className="font-bold mb-2">Feedback</h3>
              <p className="text-sm text-muted-foreground">
                Reporte bugs, sugira features ou melhore a documentação
              </p>
            </div>
            <div className="bg-background/50 backdrop-blur rounded-xl p-4">
              <h3 className="font-bold mb-2">Dados</h3>
              <p className="text-sm text-muted-foreground">
                Contribua com métricas, benchmarks ou informações de distros
              </p>
            </div>
            <div className="bg-background/50 backdrop-blur rounded-xl p-4">
              <h3 className="font-bold mb-2">Código</h3>
              <p className="text-sm text-muted-foreground">
                Envie PRs, corrija bugs ou implemente novas funcionalidades
              </p>
            </div>
          </div>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="text-base px-8">
              Visitar GitHub
            </Button>
          </a>
        </div>
      </section>

      {/* License */}
      <section className="text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Licença e Privacidade</h2>
          <p className="text-muted-foreground mb-4">
            DistroWiki é licenciado sob <strong>MIT License</strong> - livre para uso, modificação e distribuição.
          </p>
          <p className="text-sm text-muted-foreground">
            Não coletamos dados pessoais. Não usamos cookies de tracking. Sem anúncios.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
