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