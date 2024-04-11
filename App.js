import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Routes from './src/navigation/Routes';
import 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import store from './src/redux/store/Store';
const App = () => {
  return (
    <Provider store={store}>
      <Routes/>
    </Provider>
  );
};

export default App;