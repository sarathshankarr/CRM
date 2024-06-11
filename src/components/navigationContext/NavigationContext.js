import React, { createContext, useContext, useRef } from 'react';
import { CommonActions } from '@react-navigation/native';

export const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const navigationRef = useRef();

  const resetToLogin = () => {
    navigationRef.current?.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      })
    );
  };

  return (
    <NavigationContext.Provider value={{ resetToLogin, navigationRef }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);

export const useNavigationRef = () => {
  const { navigationRef } = useContext(NavigationContext);
  if (!navigationRef) {
    throw new Error("useNavigationRef must be used within a NavigationProvider");
  }
  return navigationRef;
};
