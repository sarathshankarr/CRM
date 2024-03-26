import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

const CommonHeader = ({  title }) => {
  const navigation=useNavigation();
  const GoToCart =()=>{
    navigation.navigate("Cart")
  }
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Image
          resizeMode="contain"
          source={require('../../assets/menuu.png')}
          style={styles.menuimg}
        />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.rightContainer}>
        <TouchableOpacity style={styles.iconWrapper}>
          <Image
            resizeMode="contain"
            style={styles.locationimg}
            source={require('../../assets/location.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconWrapper}>
          <Image
            style={styles.msgimg}
            source={require('../../assets/message.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={GoToCart} style={styles.iconWrapper}>
          <Image
            resizeMode="contain"
            style={styles.cartimg}
            source={require('../../assets/cart.jpg')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor:"#fff"
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    marginHorizontal: 10,
  },
  locationimg: {
    height: 25,
    width: 20,
  },
  msgimg: {
    height: 30,
    width: 35,
  },
  cartimg: {
    height: 40,
    width: 40,
  },
  menuimg: {
    height: 30,
    width: 30,
    marginHorizontal: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CommonHeader;
