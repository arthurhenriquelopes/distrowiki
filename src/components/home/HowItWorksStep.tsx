import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface HowItWorksStepProps {
  icon: LucideIcon;
  step: string;
  title: string;
  description: string;
  index: number;
  showConnector?: boolean;
}

export const HowItWorksStep = ({ icon: Icon, step, title, description, index, showConnector }: HowItWorksStepProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.15 }}
    className="relative"
  >
    <Card className="text-center bg-card/50 backdrop-blur-sm border-border/50 card-hover h-full">
      <CardContent className="p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
            <div className="relative bg-gradient-to-br from-primary to-primary-hover text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
              {step}
            </div>
          </div>
        </div>
        <Icon className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
    
    {showConnector && (
      <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/50 to-transparent"></div>
    )}
  </motion.div>
);
