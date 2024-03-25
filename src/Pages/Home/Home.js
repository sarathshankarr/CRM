import {createDrawerNavigator} from '@react-navigation/drawer';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import HomeScreen from '../../sidescreens/HomeScreen';
import Sidebar from '../../sidebar';
const Drawer = createDrawerNavigator();
const Home = () => {
  return (
    <Drawer.Navigator drawerContent={props => <Sidebar {...props}/>}>
      <Drawer.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  );
};

export default Home;
