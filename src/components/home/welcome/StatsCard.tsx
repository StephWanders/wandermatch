import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ReactNode } from "react";

interface StatsCardProps {
  icon: LucideIcon;
  title: ReactNode;  // Changed from string to ReactNode to accept both string and JSX
  stat: string;
  to: string;
  bgColor: string;
  iconColor: string;
  className?: string;  // Added to handle the new className prop
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
    <Card className={`hover:shadow-lg transition-shadow ${className}`}>
      <CardContent className={`p-6 ${bgColor}`}>
        <div className="flex items-center space-x-2">
          <Icon className={`h-5 w-5 ${iconColor}`} />
          <h3 className="font-medium text-gray-900">{title}</h3>
        </div>
        <p className="mt-2 text-2xl font-semibold">{stat}</p>
      </CardContent>
    </Card>
  );

  if (onClick) {
    return <div onClick={onClick}>{content}</div>;
  }

  return <Link to={to}>{content}</Link>;
};

export default StatsCard;