
import { useContext } from 'react';
import { MobileContext } from '@/App';

export function useMobileContext() {
  const isMobile = useContext(MobileContext);
  return isMobile;
}
