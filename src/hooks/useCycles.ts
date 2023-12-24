import { useContext } from 'react';

import { CyclesContext } from '@/contexts/CyclesContext';

export function useCycles() {
  const data = useContext(CyclesContext);

  if (!data) {
    throw new Error('useCycles must be used within a CyclesContextProvider');
  }

  return data;
}
