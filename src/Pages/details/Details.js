import React from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const Details = ({route}) => {
  const {item, name, image, category, tags, set} = route.params;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Image resizeMode="contain" style={styles.img} source={image} />
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>Price: {item.price}</Text>
          <TouchableOpacity>
            <Image
              style={styles.priceImage}
              source={require('../../../assets/heart.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.categoryContainer}>
          <Text style={styles.detailLabel}>Category:</Text>
          <Text style={styles.detailValue}>{category}</Text>
        </View>
        <View style={styles.tagsContainer}>
          <Text style={styles.detailLabel}>Tags:</Text>
          <Text style={styles.detailValue}>{item.tags}</Text>
        </View>
        <View style={styles.setContainer}>
          <Text style={styles.detailLabel}>Sets:</Text>
          <Text style={styles.detailValue}>{set}</Text>
        </View>
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Notes:</Text>
          <Text style={styles.txt}>{item.disription}</Text>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.buttonContainer}>
        <Text style={styles.buttonText}>ADD QUANTITY</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  scrollView: {
    flex: 1,
  },
  img: {
    width: '90%',
    marginTop: 50,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 20,
    width: '100%', // Ensure full width
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginVertical: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    width: '100%', // Ensure full width
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tagsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    width: '100%', // Ensure full width
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginVertical: 10,
  },
  setContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    width: '100%', // Ensure full width
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginVertical: 10,
  },
  notesContainer: {
    paddingHorizontal: 20,
    width: '100%', // Ensure full width
  },
  priceText: {
    marginVertical: 10,
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
  },
  priceImage: {
    width: 40,
    height: 40,
  },
  detailLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    marginRight: 10,
  },
  detailValue: {
    fontSize: 18,
  },
  notesLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  txt: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
    marginTop: 10,
    marginVertical: 10,
  },
  buttonContainer: {
    borderWidth: 1,
    backgroundColor: 'gray',
    width: '100%',
    paddingVertical: 20,
    position: 'absolute',
    bottom: 0,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Details;
