import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface BenefitCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  index: number;
}

export const BenefitCard = ({ icon: Icon, title, description, color, index }: BenefitCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
  >
    <Card className={`bg-gradient-to-br ${color} border-border/50 card-hover h-full`}>
      <CardContent className="p-6">
        <div className="bg-background/50 w-14 h-14 rounded-lg flex items-center justify-center mb-4 backdrop-blur-sm">
          <Icon className="w-7 h-7 text-primary" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);
