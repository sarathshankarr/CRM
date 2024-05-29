import React, { useEffect, useState } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../../redux/actions/Actions';
import ModalComponent from '../../components/ModelComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Apicall from './../../utils/serviceApi/serviceAPIComponent';

const AllCategoriesListed = ({ navigation, route }) => {
  const { categoryId } = route.params;
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (categoryId) {
      getAllCategories();
    }
  }, [categoryId]);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const addItem = (item) => {
    dispatch(addItemToCart(item));
  };

  const getAllCategories = async () => {
    try {
      const userData = await AsyncStorage.getItem('userdata');
      const token = JSON.parse(userData);
      let json = {
        pageNo: '1',
        pageSize: '10',
        categoryId: categoryId,
      };
      setIsLoading(true);
      let allProductsApi = await Apicall.getAllProducts(token.access_token, json);
      setIsLoading(false);

      if (allProductsApi && allProductsApi.data && !allProductsApi.data.error) {
        setSelectedDetails(allProductsApi.data.content);
      } else {
        console.error('Error fetching data:', allProductsApi && allProductsApi.error);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const navigateToDetails = (item) => {
    navigation.navigate('Details', {
      item,
      name: item.name,
      image: item.image,
      image2: item.image2,
      image3: item.image3,
      image4: item.image4,
      image5: item.image5,
      category: item.category,
      set: item.set,
    });
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity style={styles.productItem} onPress={() => navigateToDetails(item)}>
      <View style={styles.touchableContent}>
        <View style={styles.productImageContainer}>
          <Image
            style={styles.productImage}
            source={item.imageUrls && item.imageUrls.length > 0 ? { uri: item.imageUrls[0] } : require('../../../assets/Noimg.jpg')}
            onError={(error) => console.error('Error loading image:', error)}
          />
          <Text style={[styles.productName, item.imageUrls && item.imageUrls.length > 0 && { backgroundColor: 'rgba(0, 0, 0, 0.2)' }]}>
            {item.styleName}
          </Text>
        </View>
        <View style={styles.detailsContainer}></View>
      </View>
      <View style={styles.additionalDetailsContainer}>
        <Text>Price: {item.mrp}</Text>
        <Text numberOfLines={1} ellipsizeMode="tail">Color Name: {item.colorName}</Text>
        <View style={styles.notesContainer}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.descriptionText}>
            Description: {item.styleDesc}
          </Text>
          <TouchableOpacity onPress={() => openModal(item)} style={styles.buttonqty}>
            <Image style={styles.addqtyimg} source={require('../../../assets/qty.png')} />
            <Text>ADD QTY</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#390050" />
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: "#fff", flex: 1 }}>
      {selectedDetails.length === 0 ? (
        <View style={styles.noProductsContainer}>
          <Text style={styles.noProductsText}>There are no products available.</Text>
        </View>
      ) : (
        <FlatList
          data={selectedDetails}
          renderItem={renderProductItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          contentContainerStyle={styles.flatListContainer}
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
  productItem: {
    marginHorizontal: 4,
    marginVertical: 5,
    borderRadius: 10,
    flex: 1,
  },
  touchableContent: {
    width: '100%',
    flexDirection: 'row',
  },
  productImageContainer: {
    position: 'relative',
    width: '100%',
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  productName: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 5,
  },
  detailsContainer: {
    width: '50%',
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  additionalDetailsContainer: {
    paddingTop: 5,
  },
  notesContainer: {
    paddingVertical: 5,
  },
  descriptionText: {
    flex: 1,
  },
  buttonqty: {
    marginHorizontal: 3,
    marginVertical: 3,
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  addqtyimg: {
    height: 20,
    width: 20,
  },
  flatListContainer: {
    paddingHorizontal: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#fff"
  },
  noProductsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noProductsText: {
    fontSize: 18,
    color: '#000',
  },
});

export default AllCategoriesListed;
