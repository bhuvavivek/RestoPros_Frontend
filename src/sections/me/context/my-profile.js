import { createContext, useContext } from 'react';

// ----------------------------------------------------------------------

export const ProfileContext = createContext({});

export const useProfileContext = () => {
  const context = useContext(ProfileContext);

  if (!context) throw new Error('useProfileContext must be use inside FoodCartProvider');

  return context;
};
