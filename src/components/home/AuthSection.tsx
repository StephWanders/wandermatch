import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AuthSection = () => {
  const handleError = (error: Error) => {
    console.error("Auth error occurred:", error);
    
    if (error.message.includes("invalid_credentials")) {
      toast.error("Invalid email or password. Please check your credentials and try again.");
    } else if (error.message.includes("Email not confirmed")) {
      toast.error("Please verify your email address before signing in.");
    } else {
      toast.error("An error occurred during authentication. Please try again.");
    }
  };

  return (
    <Card className="max-w-md mx-auto bg-white/95 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Join WanderMatch</CardTitle>
        <CardDescription>Sign in or create an account to get started</CardDescription>
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
          providers={[]}
          redirectTo={window.location.origin}
          onError={handleError}
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
            },
          }}
        />
      </CardContent>
    </Card>
  );
};

export default AuthSection;