import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, RefreshCcw, AlertCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDistros } from "@/hooks/useDistros";
import { Distro } from "@/types";

const DistroQuiz = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { distros: allDistros, loading } = useDistros();
  
  const [step, setStep] = useState(0);
  const [filters, setFilters] = useState<Record<string, any>>({});

  const questions = [
    {
      id: "release",
      text: t('quiz.questions.release'),
      options: [
        { 
          label: "Estabilidade Total (Versões Fixas / LTS)", 
          value: "Fixed", 
          desc: "Ideal para trabalho e servidores. Muda pouco ao longo do tempo.",
          filter: (d: Distro) => {
            const model = (d.releaseModel || d.releaseType || "").toLowerCase();
            return model.includes("fixed") || model.includes("lts") || model.includes("stable") || model.includes("point");
          }
        },
        { 
          label: "Novidades Sempre (Rolling Release)", 
          value: "Rolling", 
          desc: "Tenha sempre a última versão dos softwares. Requer atualizações frequentes.",
          filter: (d: Distro) => {
            const model = (d.releaseModel || d.releaseType || "").toLowerCase();
            return model.includes("rolling");
          }
        },
        { 
          label: "Sem preferência", 
          value: "Any", 
          desc: "Qualquer modelo serve.",
          filter: (d: Distro) => true
        }
      ]
    },
    {
      id: "interface",
      text: t('quiz.questions.interface'),
      options: [
        { 
          label: "Estilo Windows (Barra inferior, Menu Iniciar)", 
          value: "Windows",
          filter: (d: Distro) => d.desktopEnvironments.some(de => 
            ["KDE", "Plasma", "Cinnamon", "Xfce", "MATE", "LXQt"].some(k => de.toLowerCase().includes(k.toLowerCase()))
          )
        },
        { 
          label: "Estilo macOS / Moderno (Docks, Gestos)", 
          value: "Mac",
          filter: (d: Distro) => d.desktopEnvironments.some(de => 
            ["GNOME", "Pantheon", "Budgie", "Cosmic", "Deepin"].some(k => de.toLowerCase().includes(k.toLowerCase()))
          )
        },
        { 
          label: "Sem preferência", 
          value: "Any",
          filter: (d: Distro) => true
        }
      ]
    },
    {
      id: "family",
      text: t('quiz.questions.family'),
      options: [
        { 
          label: "Base Debian/Ubuntu (.deb)", 
          value: "Debian",
          desc: "Maior compatibilidade de softwares e tutoriais na internet.",
          filter: (d: Distro) => {
            const fam = (d.family || "").toLowerCase();
            const based = (d.basedOn || "").toLowerCase();
            return fam.includes("debian") || fam.includes("ubuntu") || based.includes("debian") || based.includes("ubuntu");
          }
        },
        { 
          label: "Base Arch (Pacman/AUR)", 
          value: "Arch",
          desc: "Acesso ao AUR, rápido e leve.",
          filter: (d: Distro) => {
            const fam = (d.family || "").toLowerCase();
            const based = (d.basedOn || "").toLowerCase();
            return fam.includes("arch") || based.includes("arch") || d.name.toLowerCase().includes("manjaro") || d.name.toLowerCase().includes("endeavour");
          }
        },
        { 
          label: "Base Fedora/RedHat (.rpm)", 
          value: "Fedora",
          desc: "Tecnologias novas e segurança empresarial.",
          filter: (d: Distro) => {
            const fam = (d.family || "").toLowerCase();
            return fam.includes("fedora") || fam.includes("red hat") || fam.includes("suse");
          }
        },
        { 
          label: "Sem preferência", 
          value: "Any",
          filter: (d: Distro) => true
        }
      ]
    },
    {
      id: "purpose",
      text: t('quiz.questions.purpose'),
      options: [
        {
          label: "Jogos",
          value: "Gaming",
          desc: "Drivers NVIDIA e Steam pré-configurados.",
          filter: (d: Distro) => {
            const name = d.name.toLowerCase();
            const cat = (d.category || "").toLowerCase();
            return cat.includes("game") || name.includes("nobara") || name.includes("pop") || name.includes("bazzite") || name.includes("garuda");
          }
        },
        {
          label: "Programação / Desenvolvimento",
          value: "Dev",
          desc: "Ferramentas atualizadas e estabilidade.",
          filter: (d: Distro) => true // Programação roda bem em quase tudo, não vamos restringir demais.
        },
        {
          label: "Dia a Dia (Navegador, Office)",
          value: "Daily",
          filter: (d: Distro) => true
        }
      ]
    },
    {
      id: "hardware",
      text: t('quiz.questions.hardware'),
      options: [
        {
          label: "PC Antigo / Fraco (< 4GB RAM)",
          value: "LowSpec",
          desc: "Interfaces leves para reviver o PC.",
          filter: (d: Distro) => {
            const ram = d.idleRamUsage || 1000;
            // Se RAM Idle < 600 ou usa Xfce/Mate/LXQt
            return ram < 700 || d.desktopEnvironments.some(de => ["Xfce", "LXQt", "MATE", "Openbox", "i3"].some(k => de.toLowerCase().includes(k.toLowerCase())));
          }
        },
        {
          label: "PC Moderno (> 4GB RAM)",
          value: "HighSpec",
          filter: (d: Distro) => true
        }
      ]
    },
    {
      id: "apps",
      text: t('quiz.questions.apps'),
      options: [
        {
          label: "Loja de Aplicativos (GUI)",
          value: "GUI",
          desc: "Instalar programas como no celular.",
          filter: (d: Distro) => {
            // Assume que distros beginner friendly têm loja
            const name = d.name.toLowerCase();
            const fam = (d.family || "").toLowerCase();
            return name.includes("mint") || name.includes("ubuntu") || name.includes("pop") || name.includes("zorin") || name.includes("deepin") || name.includes("manjaro") || name.includes("fedora");
          }
        },
        {
          label: "Terminal / Linha de Comando",
          value: "CLI",
          filter: (d: Distro) => true
        }
      ]
    }
  ];

  // Filtro Estrito (Eliminatório)
  const rankedDistros = useMemo(() => {
    let current = [...allDistros];
    
    Object.keys(filters).forEach((questionId) => {
      const questionIndex = questions.findIndex(q => q.id === questionId);
      if (questionIndex >= 0) {
        const selectedOptionValue = filters[questionId];
        const option = questions[questionIndex].options.find(o => o.value === selectedOptionValue);
        
        if (option && option.filter) {
          current = current.filter(option.filter);
        }
      }
    });

    // Ordenar por popularidade/score como critério de desempate
    return current.sort((a, b) => (b.score || 0) - (a.score || 0));
  }, [allDistros, filters]);

  const handleAnswer = (questionId: string, value: string) => {
    setFilters(prev => ({ ...prev, [questionId]: value }));
    setStep(prev => prev + 1);
  };

  const resetQuiz = () => {
    setStep(0);
    setFilters({});
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // TELA DE RESULTADOS
  if (step === questions.length) {
    const topRecommendations = rankedDistros.slice(0, 3);

    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl min-h-screen flex items-center justify-center">
        <Card className="p-8 w-full space-y-8">
          <div className="text-center space-y-4">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto"
            >
              <CheckCircle2 className="w-10 h-10" />
            </motion.div>
            <h2 className="text-3xl font-bold">{t('quiz.result')}</h2>
            <p className="text-muted-foreground">
              Analisamos {allDistros.length} distribuições e encontramos as melhores para você:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {topRecommendations.map((distro, idx) => (
              <motion.div
                key={distro.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg ${idx === 0 ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}
                onClick={() => navigate(`/distro/${distro.id}`)}
              >
                {idx === 0 && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    {distro.matchScore >= 6 ? "Match Perfeito" : "Melhor Opção"}
                  </span>
                )}
                <div className="flex flex-col items-center text-center gap-3">
                  <img 
                    src={`/logos/${distro.id}.svg`} 
                    alt={distro.name} 
                    className="w-16 h-16 object-contain"
                    onError={(e) => e.currentTarget.src = `https://ui-avatars.com/api/?name=${distro.name}`}
                  />
                  <div>
                    <h3 className="font-bold text-lg">{distro.name}</h3>
                    <p className="text-xs text-muted-foreground mb-1">{distro.family}</p>
                    {/* Debug Score: <span className="text-xs">{distro.matchScore} pts</span> */}
                  </div>
                  <Button variant={idx === 0 ? "default" : "outline"} className="w-full mt-2">
                    Ver Detalhes
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {topRecommendations.length === 0 && (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold">Sem recomendações fortes</h3>
              <p className="text-muted-foreground">Tente ser menos específico ou explorar o catálogo completo.</p>
              <Button variant="link" onClick={() => navigate('/catalogo')}>Ir para o Catálogo</Button>
            </div>
          )}

          <div className="flex justify-center pt-4">
            <Button variant="ghost" onClick={resetQuiz} className="gap-2">
              <RefreshCcw className="w-4 h-4" />
              {t('quiz.retake')}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[step];

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl min-h-screen flex flex-col justify-center">
      <div className="mb-8 space-y-2 text-center md:text-left">
        <h1 className="text-4xl font-bold">{t('quiz.title')}</h1>
        <p className="text-muted-foreground">{t('quiz.subtitle')}</p>
        <p className="text-sm font-medium text-primary">
          {rankedDistros.length} opções possíveis restantes
        </p>
      </div>

      <div className="flex gap-2 mb-8">
        {questions.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-2 flex-1 rounded-full transition-all duration-500 ${idx <= step ? 'bg-primary' : 'bg-muted'}`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6 md:p-8">
            <h3 className="text-2xl font-medium mb-6">{currentQuestion.text}</h3>
            <div className="grid gap-3">
              {currentQuestion.options.map((opt) => (
                <Button 
                  key={opt.value}
                  variant="outline" 
                  className="h-auto py-4 justify-start text-left px-6 hover:border-primary hover:bg-primary/5 group relative overflow-hidden"
                  onClick={() => handleAnswer(currentQuestion.id, opt.value)}
                >
                  <div className="z-10">
                    <div className="text-lg font-medium group-hover:text-primary transition-colors">
                      {opt.label}
                    </div>
                    {opt.desc && (
                      <div className="text-sm text-muted-foreground font-normal mt-1">
                        {opt.desc}
                      </div>
                    )}
                  </div>
                  <ArrowRight className="ml-auto w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                </Button>
              ))}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DistroQuiz;
