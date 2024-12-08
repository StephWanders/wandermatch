import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuthRedirect = (session: any, loading: boolean) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) {
      navigate('/');
    }
  }, [session, navigate, loading]);
};