import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useAuthState } from "@/hooks/useAuthState";
import Index from "./pages/Index";
import CreateProfile from "./pages/CreateProfile";
import Chat from "./pages/Chat";
import Matches from "./pages/Matches";
import AccountSettings from "./pages/AccountSettings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 2,
    },
  },
});

const App = () => {
  const { loading } = useAuthState();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" className="text-primary" />
      </div>
    );
  }

  return (
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
};

export default App;