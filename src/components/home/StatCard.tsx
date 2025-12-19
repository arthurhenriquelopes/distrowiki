import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  variants?: any;
}

const parseValue = (value: string): { number: number; suffix: string } => {
  const match = value.match(/^(\d+)(.*)$/);
  if (match) {
    return { number: parseInt(match[1], 10), suffix: match[2] };
  }
  return { number: 0, suffix: value };
};

export const StatCard = ({ icon: Icon, value, label, variants }: StatCardProps) => {
  const { number, suffix } = parseValue(value);
  const { formattedValue, ref } = useCountUp({ 
    end: number, 
    duration: 2000,
    suffix 
  });

  return (
    <motion.div variants={variants} ref={ref}>
      <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
        <CardContent className="p-6 text-center">
          <Icon className="w-10 h-10 text-primary mx-auto mb-3" />
          <div className="text-4xl font-bold gradient-text mb-1">{formattedValue}</div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
