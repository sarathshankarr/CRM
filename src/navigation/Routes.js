import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../Pages/Login/Login';
import Splash from '../Pages/Splash';
import Details from '../Pages/details/Details';
import Main from '../Pages/main/Main';
import Cart from '../Pages/cart/Cart';
import Profile from '../Pages/editprofile/EditProfile';
import AllCategoriesListed from '../Pages/allcategorieslisted/AllCategoriesListed';
import CommonHeader from '../components/CommonHeader';
import AddNote from '../Pages/notes/AddNote';
import LoaderComponent from '../utils/loaderComponent/loaderComponent';
import CustomDropDown from '../components/CustomDropDown';

const Stack = createNativeStackNavigator();

const Routes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={Main}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Details"
          component={Details}
          options={({ navigation }) => ({
            header: () => (
              <CommonHeader
                navigation={navigation}
                title="All Details"
                showMessageIcon={true}
                showCartIcon={true}
                showLocationIcon={true}
              />
            ),
            headerBackVisible: true,
          })}
        />
        <Stack.Screen
          name="Cart"
          component={Cart}
          options={({ navigation }) => ({
            header: () => (
              <CommonHeader
                navigation={navigation}
                title="Order Preview"
                showMessageIcon={true}
              />
            ),
            headerBackVisible: true,
          })}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="AllCategoriesListed"
          component={AllCategoriesListed}
          options={({ navigation }) => ({
            header: () => (
              <CommonHeader
                navigation={navigation}
                title="All Categories"
                showMessageIcon={true}
                showCartIcon={true}
                showLocationIcon={true}
              />
            ),
            headerBackVisible: true,
          })}
        />
        <Stack.Screen
          name="Add Note"
          component={AddNote}
          options={{ headerShown: true }}
        />
        <Stack.Screen
          name="LoaderComponent"
          component={LoaderComponent}
          options={{ headerShown: true }}
        />
         <Stack.Screen
          name="CustomDropDown"
          component={CustomDropDown}
          options={{ headerShown: true }}
        />
      </Stack.Navigator>

    </NavigationContainer>
  );
};

export default Routes;
