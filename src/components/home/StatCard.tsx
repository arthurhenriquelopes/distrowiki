import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  variants?: any;
}

export const StatCard = ({ icon: Icon, value, label, variants }: StatCardProps) => (
  <motion.div variants={variants}>
    <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
      <CardContent className="p-6 text-center">
        <Icon className="w-10 h-10 text-primary mx-auto mb-3" />
        <div className="text-4xl font-bold gradient-text mb-1">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  </motion.div>
);
