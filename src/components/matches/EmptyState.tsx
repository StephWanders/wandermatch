import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  message: string;
}

const EmptyState = ({ message }: EmptyStateProps) => (
  <Card>
    <CardContent className="p-6 text-center text-gray-500">
      {message}
    </CardContent>
  </Card>
);

export default EmptyState;