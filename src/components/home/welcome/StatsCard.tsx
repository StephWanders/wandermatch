import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  stat: string;
  to: string;
  bgColor: string;
  iconColor: string;
  onClick?: () => void;
}

const StatsCard = ({ icon: Icon, title, stat, bgColor, iconColor, onClick }: StatsCardProps) => (
  <div onClick={onClick} className="cursor-pointer">
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className={`p-6 ${bgColor}`}>
        <div className="flex items-center space-x-2">
          <Icon className={`h-5 w-5 ${iconColor}`} />
          <h3 className="font-medium text-gray-900">{title}</h3>
        </div>
        <p className="mt-2 text-2xl font-semibold">{stat}</p>
      </CardContent>
    </Card>
  </div>
);

export default StatsCard;