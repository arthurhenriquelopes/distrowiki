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

  // Definir perguntas dinamicamente baseadas nos dados
  const questions = [
    {
      id: "release",
      text: "Como você prefere receber atualizações?",
      options: [
        { 
          label: "Estabilidade Total (Versões Fixas / LTS)", 
          value: "Fixed", 
          desc: "Ideal para trabalho e servidores. Muda pouco ao longo do tempo.",
          filter: (d: Distro) => {
            const model = (d.releaseModel || d.releaseType || "").toLowerCase();
            return model.includes("fixed") || model.includes("lts") || model.includes("stable");
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
          label: "Meio Termo (Semi-Rolling / Atualizado)", 
          value: "Semi", 
          desc: "Base estável com aplicativos atualizados.",
          filter: (d: Distro) => true // Aceita todos, mas prioriza popularidade depois
        }
      ]
    },
    {
      id: "interface",
      text: "Qual estilo visual você prefere?",
      options: [
        { 
          label: "Estilo Windows (Barra inferior, Menu Iniciar)", 
          value: "Windows",
          filter: (d: Distro) => d.desktopEnvironments.some(de => 
            ["KDE", "Plasma", "Cinnamon", "Xfce", "MATE", "LXQt"].some(k => de.includes(k))
          )
        },
        { 
          label: "Estilo macOS / Moderno (Docks, Gestos)", 
          value: "Mac",
          filter: (d: Distro) => d.desktopEnvironments.some(de => 
            ["GNOME", "Pantheon", "Budgie", "Cosmic"].some(k => de.includes(k))
          )
        },
        { 
          label: "Minimalista / Performance Máxima", 
          value: "Minimal",
          filter: (d: Distro) => d.desktopEnvironments.some(de => 
            ["Xfce", "LXQt", "i3", "Openbox", "Mate"].some(k => de.includes(k))
          )
        }
      ]
    },
    {
      id: "family",
      text: "Você tem preferência por alguma base?",
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
          desc: "Acesso ao AUR (repositório gigante), rápido e leve.",
          filter: (d: Distro) => {
            const fam = (d.family || "").toLowerCase();
            const based = (d.basedOn || "").toLowerCase();
            return fam.includes("arch") || based.includes("arch") || d.name.includes("Manjaro") || d.name.includes("Endeavour");
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
          label: "Sem preferência / Não sei", 
          value: "Any",
          filter: (d: Distro) => true
        }
      ]
    }
  ];

  // Calcular pontuação de match para cada distro
  const rankedDistros = useMemo(() => {
    if (Object.keys(filters).length === 0) return allDistros;

    const scored = allDistros.map(distro => {
      let matchScore = 0;
      let totalQuestionsAnswered = 0;

      // Q1: Release Model
      if (filters["release"]) {
        totalQuestionsAnswered++;
        const model = (distro.releaseModel || distro.releaseType || "").toLowerCase();
        if (filters["release"] === "Fixed" && (model.includes("fixed") || model.includes("lts") || model.includes("stable"))) matchScore += 3;
        else if (filters["release"] === "Rolling" && model.includes("rolling")) matchScore += 3;
        else if (filters["release"] === "Semi") matchScore += 1; // Meio termo ganha ponto em tudo
      }

      // Q2: Interface
      if (filters["interface"]) {
        totalQuestionsAnswered++;
        const deList = (distro.desktopEnvironments || []).map(d => d.toLowerCase());
        const hasDE = (names: string[]) => deList.some(de => names.some(n => de.includes(n.toLowerCase())));

        if (filters["interface"] === "Windows" && hasDE(["KDE", "Plasma", "Cinnamon", "Xfce", "MATE", "LXQt"])) matchScore += 3;
        else if (filters["interface"] === "Mac" && hasDE(["GNOME", "Pantheon", "Budgie", "Cosmic", "Deepin"])) matchScore += 3;
        else if (filters["interface"] === "Minimal" && hasDE(["Xfce", "LXQt", "i3", "Openbox", "Mate", "Window Manager"])) matchScore += 3;
      }

      // Q3: Family
      if (filters["family"]) {
        totalQuestionsAnswered++;
        const fam = (distro.family || "").toLowerCase();
        const based = (distro.basedOn || "").toLowerCase();
        
        if (filters["family"] === "Debian" && (fam.includes("debian") || fam.includes("ubuntu") || based.includes("debian") || based.includes("ubuntu"))) matchScore += 3;
        else if (filters["family"] === "Arch" && (fam.includes("arch") || based.includes("arch"))) matchScore += 3;
        else if (filters["family"] === "Fedora" && (fam.includes("fedora") || fam.includes("red") || fam.includes("suse"))) matchScore += 3;
        else if (filters["family"] === "Any") matchScore += 1;
      }

      return { ...distro, matchScore };
    });

    // Filtra apenas distros com alguma relevância e ordena
    return scored
      .filter(d => d.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore || (b.score || 0) - (a.score || 0));

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
