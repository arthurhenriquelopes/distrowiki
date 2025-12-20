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
    <div className="h-full bg-card border border-border/50 rounded-xl p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 group">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors duration-300 ${
        index === 0 ? "bg-blue-500/10 text-blue-600 group-hover:bg-blue-500/20" :
        index === 1 ? "bg-green-500/10 text-green-600 group-hover:bg-green-500/20" :
        index === 2 ? "bg-purple-500/10 text-purple-600 group-hover:bg-purple-500/20" :
        "bg-orange-500/10 text-orange-600 group-hover:bg-orange-500/20"
      }`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  </motion.div>
);
