import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Sidebar = ({userName, companyName}) => {
  const navigation = useNavigation();
  const goToHome = () => {
    console.log('Navigating to Home');
    navigation.navigate('Home');
  };
  const goToCategories = () => {
    console.log('Navigating to Categories');
    navigation.navigate('Categories');
  };
  const goToOrder = () => {
    console.log('Navigating to Order');
    navigation.navigate('Order');
  };
  
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userdata');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };
  return (
    <View style={style.container}>
      <View style={{backgroundColor: '#56994B'}}>
        <View style={style.header}>
          <TouchableOpacity>
            <Image
              style={[style.img, {tintColor: '#fff'}]}
              source={require('../assets/profile.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity style={style.editbox}>
            <Image
              style={[style.editimg, {tintColor: '#fff'}]}
              source={require('../assets/edit.png')}
            />
            <Text style={style.edittxt}>EDIT PROFILE</Text>
          </TouchableOpacity>
        </View>
        <Text style={style.usertxt}>name:{userName}</Text>
        <Text style={style.companynametxt}>companyName:{companyName}</Text>
      </View>
      <TouchableOpacity
        onPress={goToHome}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 10,
          marginVertical: 25,
        }}>
        <Image
          style={{height: 40, width: 40}}
          source={require('../assets/store.png')}
        />
        <Text style={{fontSize: 16, marginLeft: 10}}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={goToCategories}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 10,
        }}>
        <Image
          style={{height: 40, width: 40}}
          source={require('../assets/cate.png')}
        />
        <Text style={{fontSize: 16, marginLeft: 10}}>Categories</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={goToOrder}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 10,
          marginVertical: 25,
        }}>
        <Image
          style={{height: 40, width: 40}}
          source={require('../assets/order.png')}
        />
        <Text style={{fontSize: 16, marginLeft: 10}}>Order</Text>
      </TouchableOpacity>
      <View>
      <TouchableOpacity onPress={handleLogout} style={style.logoutbox}>
            <Image
              style={[style.logoutimg, {tintColor: '#fff'}]}
              source={require('../assets/logout.png')}
            />
            <Text style={style.logouttxt}>Logout</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  img: {
    height: 60,
    width: 60,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  editimg: {
    height: 15,
    width: 15,
    alignItems: 'center',
    marginTop: 3,
    marginRight: 8,
  },
  editbox: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 9,
    flexDirection: 'row',
    marginLeft: 30,
  },
  edittxt: {
    color: '#fff',
    fontWeight: 'bold',
  },
  usertxt: {
    marginLeft: 20,
    fontSize: 20,
    marginHorizontal: 10,
    color: '#fff',
  },
  companynametxt: {
    marginLeft: 20,
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
  },
  logoutbox: {
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: 'gray',
    borderRadius: 15,
    paddingVertical: 12,
    flexDirection: 'row',
    marginHorizontal: 30,
    justifyContent: 'center',
  },
  logoutimg: {
    height: 20,
    width: 15,
    marginRight: 8,
  },
  logouttxt: {
    textAlign: 'center',
    color: '#fff',
    fontSize:15,
    fontWeight:"bold"
  },
});
export default Sidebar;
