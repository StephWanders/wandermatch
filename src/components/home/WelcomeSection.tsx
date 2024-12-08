import { Heart, MessageCircle, Globe } from "lucide-react";
import StatsCard from "./welcome/StatsCard";
import { useWelcomeData } from "@/hooks/useWelcomeData";
import LocalEventsSection from "../LocalEventsSection";
import SeasonalSection from "../SeasonalSection";
import InspirationSection from "../InspirationSection";
import { useNavigate } from "react-router-dom";

interface WelcomeSectionProps {
  session: any;
  profile: any;
}

const WelcomeSection = ({ session, profile }: WelcomeSectionProps) => {
  const navigate = useNavigate();
  const { pendingMatches, unreadMessages, firstUnreadChat } = useWelcomeData(session?.user?.id);

  const handleChatClick = () => {
    console.log('Navigating to chat');
    if (firstUnreadChat) {
      navigate(`/chat/${firstLet me check the navigation behavior step by step:

1. Looking at the console logs, I can see the navigation is happening but there might be an issue with the routing in App.tsx
2. The current route setup has a redirect from /chat to /matches which is causing the issue:
```typescript
<Route path="/chat" element={<Navigate to="/matches" replace />} />
```

Let's fix this by updating the routing to properly handle the chat navigation:

<lov-code>
Let's update App.tsx to fix the chat routing:

<lov-write file_path="src/App.tsx">
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CreateProfile from "./pages/CreateProfile";
import Chat from "./pages/Chat";
import Matches from "./pages/Matches";
import AccountSettings from "./pages/AccountSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/create-profile" element={<CreateProfile />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:matchId" element={<Chat />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/account-settings" element={<AccountSettings />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;