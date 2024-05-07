import React, { useState, useEffect, useCallback } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Apicall from './../../utils/serviceApi/serviceAPIComponent';
import { PRODUCT_DETAILS } from '../../components/ProductDetails';
import ModalComponent from '../../components/ModelComponent';

const HomeAllProducts = ({ navigation }) => {
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getAllProducts();
  }, []);

  const getAllProducts = async () => {
    setIsLoading(true);
    const userData = await AsyncStorage.getItem('userdata');
    const token = JSON.parse(userData);

    let json = {
      pageNo: '1',
      pageSize: '90',
      categoryId: '',
    };

    let allProductsApi = await Apicall.getAllProducts(token.access_token, json);
    setIsLoading(false);

    if (allProductsApi && allProductsApi.data) {
      if (allProductsApi.data.error) {
        // Handle error
      } else {
        setSelectedDetails(allProductsApi.data.content);
      }
    } else if (allProductsApi && allProductsApi.error) {
      // Handle error
      console.log('error ', allProductsApi.error);
    } else {
      // Handle error
    }
  };

  const toggleSearchInput = () => {
    setShowSearchInput(!showSearchInput);
    setSearchQuery('');
  };

  const openModal = item => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const renderProductItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={styles.productItem}
        onPress={() =>
          selectedDetails === PRODUCT_DETAILS
            ? navigation.navigate('AllCategoriesListed', {
                item,
                name: item.colorName,
                categoryId: item.categoryId,
                image: item.imageUrls[0],
              })
            : navigation.navigate('Details', {
                item,
                name: item.name,
                image: item.image,
                image2: item.image2,
                image3: item.image3,
                image4: item.image4,
                image5: item.image5,
                category: item.category,
                disription: item.disription,
                tags: item.tags,
                set: item.set,
              })
        }>
        <View style={styles.productImageContainer}>
          {item.imageUrls && item.imageUrls.length > 0 ? (
            <Image
              style={styles.productImage}
              source={{ uri: item.imageUrls[0] }}
            />
          ) : (
            <View
              style={[
                styles.productImage,
                { backgroundColor: '#D3D3D3' },
              ]}
            />
          )}
          <Text style={styles.productName}>{item.styleName}</Text>
        </View>

        <View style={styles.additionalDetailsContainer}>
          <Text>Price: {item.mrp}</Text>
          <Text numberOfLines={1} ellipsizeMode="tail">
            Color Name: {item.colorName}
          </Text>
          <View style={styles.notesContainer}>
            <Text numberOfLines={1} ellipsizeMode="tail">
              Description: {item.styleDesc}
            </Text>
            <TouchableOpacity onPress={() => openModal(item)} style={styles.buttonqty}>
              <Text>ADD QTY</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [navigation, selectedDetails]
  );

  const filteredProducts = selectedDetails.filter(item =>
    item.styleName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        {showSearchInput ? (
          <TextInput
            style={styles.searchInput}
            autoFocus={true}
            onBlur={toggleSearchInput}
            onChangeText={text => setSearchQuery(text)}
            placeholder="Search"
            placeholderTextColor="#000"
          />
        ) : (
          <Text style={styles.text}>
            {selectedDetails ? selectedDetails.length + ' Products Listed' : ''}
          </Text>
        )}
        <TouchableOpacity style={styles.searchButton} onPress={toggleSearchInput}>
          <Image style={styles.image} source={require('../../../assets/search.png')} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          size="large"
          color="green"
        />
      ) : (
        <FlatList
          data={searchQuery ? filteredProducts : selectedDetails}
          renderItem={renderProductItem}
          keyExtractor={item => item.styleId.toString()}
          numColumns={2}
          contentContainerStyle={styles.productList}
        />
      )}

      <ModalComponent
        modalVisible={modalVisible}
        closeModal={() => setModalVisible(false)}
        selectedItem={selectedItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    marginHorizontal: 2,
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
  buttonqty: {
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default HomeAllProducts;
