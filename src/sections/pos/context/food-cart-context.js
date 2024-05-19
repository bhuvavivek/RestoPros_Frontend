import { createContext, useContext } from 'react';

// ----------------------------------------------------------------------

export const FoodCartContext = createContext({});

export const useFoodCartContext = () => {
  const context = useContext(FoodCartContext);

  if (!context) throw new Error('useFoodCartContext must be use inside FoodCartProvider');

  return context;
};
