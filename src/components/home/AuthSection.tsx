import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

const AuthSection = () => {
  const [searchParams] = useSearchParams();
  const view = searchParams.get('view');

  if (!view) return null;

  return (
    <Card className="max-w-md mx-auto bg-white/95 backdrop-blur-sm">
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
  );
};

export default AuthSection;