import React from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity } from 'react-native';

const AllCategoriesListed = ({ route }) => {
  const { item } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.additionalDetailsContainer}>
        <Text>Price: {item.price}</Text>
        <Text>Tags: {item.tags}</Text>
        <View style={styles.notesContainer}>
          <Text>Notes: {item.notes}</Text> {/* Assuming notes field is lowercase 'notes' */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button}>
              <Image style={{ height: 20, width: 20 }} source={require('../../../assets/heart.png')} />
              <Text>WISHLIST</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonqty}>
              <Image style={{ height: 20, width: 20 }} source={require('../../../assets/qty.png')} />
              <Text>ADD QTY</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  additionalDetailsContainer: {
    paddingTop: 5,
  },
  notesContainer: {
    paddingVertical: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginHorizontal: 4,
  },
  button: {
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 5,
    flexDirection: 'row',
  },
  buttonqty: {
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 5,
    flexDirection: 'row',
    paddingHorizontal: 5,
  },
});

export default AllCategoriesListed;
