import React, { useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { PRODUCT_DETAILS } from '../components/ProductDetails';
import { API } from '../../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { getAllCategories } from '../../utils/serviceApi/serviceAPIComponent';

const HomeCategories = ({ navigation }) => {
  const [selectedDetails, setSelectedDetails] = useState([]);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  console.log("Number of categories:", selectedDetails.length);

  useEffect(() => {
    getCategoriesProducts();
  }, []);

  const getCategoriesProducts = async () => {
    try {
      console.log('Attempting to retrieve token from AsyncStorage...');
      const tokenString = await AsyncStorage.getItem('userdata');
      console.log('Retrieved token from AsyncStorage:', tokenString);
      const token = JSON.parse(tokenString);

      console.log('Calling getAllCategories API...');
      const { data, error } = await getAllCategories(token.access_token);
      console.log('Received data from getAllCategories:', data);

      if (data) {
        setSelectedDetails(data); // Update state with received data
      } else {
        console.error('Error fetching categories:', error);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };


  const handleCategoryPress = (details) => {
    setSelectedDetails(details);
  };

  const toggleSearchInput = () => {
    setShowSearchInput(!showSearchInput);
  };

  const onFocusTextInput = () => {
    setModalVisible(true);
  };

  const renderProductItem = ({ item }) => {
    // Destructure item
    const { categoryDesc, imageUrls } = item;

    return (

      <TouchableOpacity
        style={styles.productItem}
        onPress={() => {
          console.log('Pressed item:', item);
          navigation.navigate('AllCategoriesListed', { item, categoryId: item.categoryId });
        }}
        
      >

        <View style={styles.productImageContainer}>
          {imageUrls && imageUrls.length > 0 ? (
            <Image
              style={styles.productImage}
              source={{ uri: imageUrls[0] }}
              onError={(error) => console.error('Error loading image:', error)}
            />
          ) : (
            <Text>No Image</Text>
          )}
          <Text style={styles.productName}>{categoryDesc}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        {showSearchInput ? (
          <TextInput
            style={styles.searchInput}
            autoFocus={true}
            onBlur={toggleSearchInput}
            onFocus={onFocusTextInput}
            placeholder="Search"
          />
        ) : (
          <Text style={styles.text}>{selectedDetails ? selectedDetails.length + ' Categories Listed' : ''}</Text>
        )}
        <TouchableOpacity
          style={styles.searchButton}
          onPress={toggleSearchInput}>
          <Image
            style={styles.image}
            source={require('../../../assets/search.png')}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.head}></View>

      <FlatList
        data={selectedDetails}
        renderItem={renderProductItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={styles.productList}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    elevation: 3,
    backgroundColor: '#fff',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  crmtxt: {
    color: 'gray',
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  menuimg: {
    height: 30,
    width: 30,
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
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  title: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    paddingHorizontal: 45,
  },
  titleOne: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 10,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 45,
  },
  activeCategory: {
    backgroundColor: 'green',
  },
  activeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 5,
  },
  text: {
    fontSize: 16,
    marginRight: 'auto',
    color: '#000',
  },
  searchButton: {
    marginLeft: 'auto',
  },
  image: {
    height: 30,
    width: 30,
  },
  productList: {
    paddingTop: 10,
  },
  productItem: {
    flex: 1,
    marginHorizontal: 4,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    overflow: 'hidden',
  },
  productImageContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  productName: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
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

export default HomeCategories;
