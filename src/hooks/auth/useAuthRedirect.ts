import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuthRedirect = (session: any, loading: boolean) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) {
      console.log('No session found after loading, redirecting to home');
      navigate('/');
    }
  }, [session, navigate, loading]);
};