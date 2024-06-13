// src/components/navigationContext/NavigationContext.js
import React, { createContext, useContext, useRef } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';

const NavigationContext = createContext(null);

export const NavigationProvider = ({ children }) => {
  const navigationRef = useNavigationContainerRef();

  return (
    <NavigationContext.Provider value={navigationRef}>
      <NavigationContainer ref={navigationRef}>
        {children}
      </NavigationContainer>
    </NavigationContext.Provider>
  );
};

export const useNavigationContext = () => useContext(NavigationContext);
