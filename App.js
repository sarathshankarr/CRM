import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Routes from './src/navigation/Routes';
import 'react-native-gesture-handler';
const App = () => {
  return (
    <>
      <Routes/>
    </>
  );
};

export default App;