import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  stat: string | number;
  to: string;
  bgColor: string;
  iconColor: string;
}

const StatsCard = ({ icon: Icon, title, stat, to, bgColor, iconColor }: StatsCardProps) => (
  <Card className="bg-white/95 backdrop-blur-sm hover:bg-white/100 transition-all cursor-pointer">
    <Link to={to}>
      <CardContent className="p-6 flex flex-col items-center space-y-4">
        <div className={`h-12 w-12 rounded-full ${bgColor} flex items-center justify-center`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <div className="text-center">
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-gray-600">{stat}</p>
        </div>
      </CardContent>
    </Link>
  </Card>
);

export default StatsCard;