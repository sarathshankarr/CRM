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
    <Bottom.Navigator>
      <Bottom.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({color, size}) => (
            <Image
              source={require('../../assets/store.png')}
              style={{height: 24, width: 24, tintColor: color}}
            />
          ),
          headerShown: true,
          headerTitle: 'Home', // You can set a custom header title if needed
          header: ({navigation}) => (
            <CommonHeader navigation={navigation} title="Home" />
          ),
        }}
      />
      <Bottom.Screen
        name="Categories"
        component={Categories}
        options={{
          tabBarIcon: ({color, size}) => (
            <Image
              source={require('../../assets/cate.png')}
              style={{height: 24, width: 24, tintColor: color}}
            />
          ),
          headerShown: true,
          headerTitle: 'Categories', // Set the title for Categories screen
          header: ({navigation}) => (
            <CommonHeader navigation={navigation} title="Categories" />
          ),
        }}
      />

      <Bottom.Screen
        name="Order"
        component={Order}
        options={{
          tabBarIcon: ({color, size}) => (
            <Image
              source={require('../../assets/order.png')}
              style={{height: 24, width: 24, tintColor: color}}
            />
          ),
          headerShown: true,
          headerTitle: 'Order', // Set the title for Order screen
          header: ({navigation}) => (
            <CommonHeader navigation={navigation} title="Order" />
          ),
        }}
      />
    </Bottom.Navigator>
  );
};

export default HomeScreen;
