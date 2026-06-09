import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    const contentWrapper = document.querySelector('.content-wrapper');
    if (contentWrapper) {
      contentWrapper.scrollTop = 0;
    }
  }, [pathname]);

  return null;
};
