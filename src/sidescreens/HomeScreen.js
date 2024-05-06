import React from 'react';
import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Categories from '../bottom/Categories';
import Order from '../bottom/Order';
import CommonHeader from '../components/CommonHeader';
import Home from '../bottom/Home';

const Bottom = createBottomTabNavigator();

const HomeScreen = ({navigation}) => {
  return (
    <Bottom.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          let icon;
          if (route.name === 'Home') {
            icon = require('../../assets/store.png');
          } else if (route.name === 'Categories') {
            icon = require('../../assets/cate.png');
          } else if (route.name === 'Order') {
            icon = require('../../assets/order.png');
          }
          return (
            <Image
              source={icon}
              style={{height: 24, width: 24, tintColor: color}}
            />
          );
        },
        headerShown: true,
        headerTitle: route.name,
        header: ({navigation}) => {
          const showDrawerButton = !['Login', 'Main', 'Cart'].includes(
            route.name,
          );
          return (
            <CommonHeader
              navigation={navigation}
              title={route.name}
              showDrawerButton={showDrawerButton}
              showMessageIcon={true}
              showCartIcon={true}
              showLocationIcon={true}
            />
          );
        },
        tabBarActiveTintColor: 'green',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Bottom.Screen
        name="Home"
        component={Home}
        options={{headerTitle: 'Home'}}
      />
      <Bottom.Screen
        name="Categories"
        component={Categories}
        options={{headerTitle: 'Categories'}}
      />
      <Bottom.Screen
        name="Order"
        component={Order}
        options={{headerTitle: 'Order'}}
      />
    </Bottom.Navigator>
  );
};

export default HomeScreen;
