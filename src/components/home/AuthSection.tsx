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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <Card className="max-w-md w-full mx-4 bg-white/95 backdrop-blur-sm relative animate-scale-in">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 text-accent-400 hover:text-accent-600 transition-colors"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-display text-accent-700">
            {view === 'sign_up' ? 'Create an Account' : 'Welcome Back'}
          </CardTitle>
          <CardDescription className="text-accent-500 font-body">
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
                    brand: '#00BFA6',
                    brandAccent: '#008F7D',
                    brandButtonText: 'white',
                    defaultButtonBackground: 'white',
                    defaultButtonBackgroundHover: '#F5F5F5',
                    defaultButtonBorder: '#E6E6E6',
                    defaultButtonText: '#424242',
                    dividerBackground: '#E6E6E6',
                    inputBackground: 'white',
                    inputBorder: '#E6E6E6',
                    inputBorderHover: '#00BFA6',
                    inputBorderFocus: '#00BFA6',
                    inputText: '#424242',
                    inputLabelText: '#424242',
                    inputPlaceholder: '#999999',
                  },
                  borderWidths: {
                    buttonBorderWidth: '1px',
                    inputBorderWidth: '1px',
                  },
                  radii: {
                    borderRadiusButton: '8px',
                    buttonBorderRadius: '8px',
                    inputBorderRadius: '8px',
                  },
                  space: {
                    inputPadding: '12px',
                    buttonPadding: '12px',
                  },
                  fonts: {
                    bodyFontFamily: `'Roboto', sans-serif`,
                    buttonFontFamily: `'Roboto', sans-serif`,
                    inputFontFamily: `'Roboto', sans-serif`,
                    labelFontFamily: `'Roboto', sans-serif`,
                  },
                },
              },
              className: {
                container: 'space-y-4',
                button: 'font-medium',
                label: 'font-medium',
                input: 'font-normal',
                divider: 'my-4',
              },
            }}
            view={view === 'sign_up' ? 'sign_up' : 'sign_in'}
            providers={[]}
            redirectTo={window.location.origin}
            onError={(error) => {
              console.error('Auth error:', error);
              if (error.message === 'User already registered') {
                toast.error('This email is already registered. Please sign in instead.');
                navigate('/?view=sign_in');
              } else {
                toast.error(error.message);
              }
            }}
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