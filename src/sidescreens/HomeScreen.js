import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import Store from '../bottom/Store';
import Categories from '../bottom/Categories';
import Order from '../bottom/Order';
import BottomIcons from '../components/BottomIcons';
const Bottom = createBottomTabNavigator();

const HomeScreen = () => {
  return (
    <>
      <Bottom.Navigator>
        <Bottom.Screen
          name="Home"
          component={Store}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Image
                source={require('../../assets/store.png')}
                style={{ height: 24, width: 24, tintColor: color }}
              />
            ),
          }}
        />
        <Bottom.Screen
          name="Categories"
          component={Categories}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Image
                source={require('../../assets/cate.png')}
                style={{ height: 24, width: 24, tintColor: color }}
              />
            ),
          }}
        />
        <Bottom.Screen
          name="Order"
          component={Order}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Image
                source={require('../../assets/order.png')}
                style={{ height: 24, width: 24, tintColor: color }}
              />
            ),
          }}
        />
      </Bottom.Navigator>
    </>
  );
};

export default HomeScreen;
