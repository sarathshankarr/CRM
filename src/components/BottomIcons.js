import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';

const BottomIcons = () => {
  return (
    <View style={styles.container}>
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
      <TouchableOpacity style={styles.iconWrapper}>
        <Image
          resizeMode="contain"
          style={styles.cartimg}
          source={require('../../assets/cart.jpg')}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10, // Adjust this value as needed
    backgroundColor: '#fff', // Adjust background color as needed
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
});

export default BottomIcons;
