// App.js
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiClient from './src/config/apiClient';
import store from './src/redux/store/Store';
import Routes from './src/navigation/Routes';
import { NavigationProvider, useNavigationContext } from './src/components/navigationContext/NavigationContext';
import 'react-native-gesture-handler';

const App = () => {
  const navigationRef = useNavigationContext();

  useEffect(() => {
    const interceptor = ApiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response && error.response.status === 401) {
          try {
            await AsyncStorage.multiRemove([
              'userData', 
              'loggedIn', 
              'userRole', 
              'userRoleId', 
              'loggedInUser', 
              'selectedCompany'
            ]);

            if (navigationRef && navigationRef.reset) {
              navigationRef.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } else {
              console.error('Navigation reset function not available');
            }
          } catch (redirectError) {
            console.error('Redirect to login error:', redirectError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      ApiClient.interceptors.response.eject(interceptor);
    };
  }, [navigationRef]);

  return (
    <Provider store={store}>
      <NavigationProvider>
        <Routes />
      </NavigationProvider>
    </Provider>
  );
};

export default App;
