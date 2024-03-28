import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Pending from '../Pages/pending/Pending';
import Completed from '../Pages/completed/Completed';
import Unapproved from '../Pages/unapproved/Unapproved';

const Tab = createMaterialTopTabNavigator();

const Order = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Pending" component={Pending} />
      <Tab.Screen name="Completed" component={Completed} />
      <Tab.Screen name="Unapproved" component={Unapproved} />
    </Tab.Navigator>
  );
};

export default Order;
