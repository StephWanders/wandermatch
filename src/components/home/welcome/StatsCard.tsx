import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ReactNode } from "react";

interface StatsCardProps {
  icon: LucideIcon;
  title: ReactNode;
  stat: string;
  to?: string; // Made optional
  bgColor: string;
  iconColor: string;
  className?: string;
  onClick?: () => void;
}

const StatsCard = ({ 
  icon: Icon, 
  title, 
  stat, 
  to, 
  bgColor, 
  iconColor, 
  className = "", 
  onClick 
}: StatsCardProps) => {
  const content = (
    <Card className={`group relative overflow-hidden hover:shadow-xl transition-all duration-300 ${className}`}>
      <div className={`absolute inset-0 ${bgColor} opacity-50 group-hover:opacity-70 transition-opacity duration-300`} />
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent" />
      
      <CardContent className="relative p-6 z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${iconColor} bg-white/90 backdrop-blur-sm shadow-sm group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-medium text-gray-900">{title}</h3>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-2xl font-semibold text-gray-900 tracking-tight">
            {stat}
          </p>
          <div className="h-1 w-16 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full group-hover:w-24 transition-all duration-300" />
        </div>
      </CardContent>
    </Card>
  );

  if (onClick) {
    return <div onClick={onClick} className="cursor-pointer">{content}</div>;
  }

  if (!to) {
    return content;
  }

  return <Link to={to}>{content}</Link>;
};

export default StatsCard;