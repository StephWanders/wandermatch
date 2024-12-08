import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSearchParams, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const AuthSection = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const view = searchParams.get('view');

  if (!view) return null;

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="max-w-md w-full mx-4 bg-white/95 backdrop-blur-sm relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <CardHeader>
          <CardTitle>{view === 'sign_up' ? 'Create an Account' : 'Welcome Back'}</CardTitle>
          <CardDescription>
            {view === 'sign_up' 
              ? 'Sign up to start finding your perfect travel companion' 
              : 'Sign in to continue your journey'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#2563eb',
                    brandAccent: '#1d4ed8',
                  },
                },
              },
            }}
            view={view === 'sign_up' ? 'sign_up' : 'sign_in'}
            providers={[]}
            redirectTo={window.location.origin}
            localization={{
              variables: {
                sign_in: {
                  email_input_placeholder: "Your email address",
                  password_input_placeholder: "Your password",
                  email_label: "Email",
                  password_label: "Password",
                  button_label: "Sign in",
                  loading_button_label: "Signing in ...",
                  social_provider_text: "Sign in with {{provider}}",
                  link_text: "Already have an account? Sign in",
                },
                sign_up: {
                  email_input_placeholder: "Your email address",
                  password_input_placeholder: "Create a password",
                  email_label: "Email",
                  password_label: "Password",
                  button_label: "Sign up",
                  loading_button_label: "Signing up ...",
                  social_provider_text: "Sign up with {{provider}}",
                  link_text: "Don't have an account? Sign up",
                },
                forgotten_password: {
                  link_text: "Forgot your password?",
                },
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthSection;