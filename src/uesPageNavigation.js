// hooks/usePageNavigation.js
import { useLocation, useNavigate } from 'react-router-dom';

const usePageNavigation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const navigateToPage = (pageURL, stateData) => {
    navigate(pageURL, { state: stateData });
  };

  return { state, navigateToPage };
};

export default usePageNavigation;
