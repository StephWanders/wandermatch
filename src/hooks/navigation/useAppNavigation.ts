import { useNavigate } from 'react-router-dom';

export const useAppNavigation = () => {
  const navigate = useNavigate();

  const goToChat = () => {
    console.log('Navigating to chat');
    navigate('/chat');
  };

  const goToMatches = (tab?: string) => {
    console.log('Navigating to matches', tab);
    navigate(tab ? `/matches?tab=${tab}` : '/matches');
  };

  const goToPendingMatches = () => {
    console.log('Navigating to pending matches tab');
    navigate('/matches?tab=pending');
  };

  return {
    goToChat,
    goToMatches,
    goToPendingMatches
  };
};