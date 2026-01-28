import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DistroQuiz = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const questions = [
    {
      id: 1,
      text: t('quiz.questions.experience'),
      options: [
        { label: "Iniciante", value: "beginner" },
        { label: "Intermediário", value: "intermediate" },
        { label: "Avançado", value: "advanced" }
      ]
    },
    {
      id: 2,
      text: t('quiz.questions.hardware'),
      options: [
        { label: "Antigo / Fraco", value: "low" },
        { label: "Moderno", value: "high" }
      ]
    },
    {
      id: 3,
      text: t('quiz.questions.usage'),
      options: [
        { label: "Dia a dia (Web, Office)", value: "daily" },
        { label: "Jogos", value: "gaming" },
        { label: "Programação", value: "dev" }
      ]
    }
  ];

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [step]: value });
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setStep(questions.length); // results step
    }
  };

  const resetQuiz = () => {
    setStep(0);
    setAnswers({});
  };

  if (step === questions.length) {
    // mock result logic
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl min-h-screen flex items-center justify-center">
        <Card className="p-8 w-full text-center space-y-6">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto"
          >
            <CheckCircle2 className="w-10 h-10" />
          </motion.div>
          
          <h2 className="text-3xl font-bold">{t('quiz.result')}</h2>
          <p className="text-muted-foreground">Baseado nas suas respostas, recomendamos:</p>
          
          <div className="bg-muted/50 p-6 rounded-xl border border-border">
            <h3 className="text-2xl font-bold mb-2">Linux Mint</h3>
            <p className="mb-4">Perfeito para iniciantes, visual familiar e muito estável.</p>
            <Button onClick={() => navigate('/distro/linux-mint')}>Ver Detalhes</Button>
          </div>

          <Button variant="outline" onClick={resetQuiz} className="gap-2">
            <RefreshCcw className="w-4 h-4" />
            {t('quiz.retake')}
          </Button>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[step];

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl min-h-screen flex items-center justify-center">
      <div className="w-full space-y-8">
        <div className="space-y-2">
            <h1 className="text-4xl font-bold">{t('quiz.title')}</h1>
            <p className="text-muted-foreground">{t('quiz.subtitle')}</p>
        </div>

        <div className="flex gap-2 mb-8">
            {questions.map((_, idx) => (
                <div 
                    key={idx} 
                    className={`h-2 flex-1 rounded-full transition-colors ${idx <= step ? 'bg-primary' : 'bg-muted'}`}
                />
            ))}
        </div>

        <Card className="p-6 md:p-8">
            <h3 className="text-2xl font-medium mb-6">{currentQuestion.text}</h3>
            <div className="grid gap-3">
                {currentQuestion.options.map((opt) => (
                    <Button 
                        key={opt.value}
                        variant="outline" 
                        className="h-14 justify-start text-lg px-6 hover:border-primary hover:bg-primary/5"
                        onClick={() => handleAnswer(opt.value)}
                    >
                        {opt.label}
                        <ArrowRight className="ml-auto w-4 h-4 opacity-50" />
                    </Button>
                ))}
            </div>
        </Card>
      </div>
    </div>
  );
};

export default DistroQuiz;
