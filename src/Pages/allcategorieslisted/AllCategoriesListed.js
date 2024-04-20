import React, { useEffect, useState } from 'react';
import { Text, View, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
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

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  const openModal = item => {
    console.log('openModal called with item:', item);
    setSelectedItem(item);
    setModalVisible(true);
  };

  const addItem = item => {
    dispatch(addItemToCart(item));
  };

  useEffect(() => {
    if (categoryId) {
      getAllCategories();
    }
  }, [categoryId]);

  const getAllCategories = async () => {
    const userData = await AsyncStorage.getItem('userdata');
    const token = JSON.parse(userData);

    let json = {
      "pageNo": "1",
      "pageSize": "10",
      "categoryId": categoryId
    };

    setIsLoading(true);

    let allProductsApi = await Apicall.getAllProducts(token.access_token, json);
    setIsLoading(false);

    if (allProductsApi && allProductsApi.data && !allProductsApi.data.error) {
      setSelectedDetails(allProductsApi.data.content);
    } else {
      console.log('Error fetching data:', allProductsApi && allProductsApi.error);
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
            source={{ uri: item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls[0] : null }}
            onError={(error) => console.error('Error loading image:', error)}
          />
          <Text style={styles.productName}>{item.colorName}</Text>
        </View>
        <View style={styles.detailsContainer}>
        </View>
      </View>
      <View style={styles.additionalDetailsContainer}>
        <Text>Price: {item.mrp}</Text>
        <Text>Name: {item.styleName}</Text>
        <View style={styles.notesContainer}>
          <Text>Discription: {item.styleDesc}</Text>
          <View style={styles.buttonsContainer}>
            <View style={{}} />
            <TouchableOpacity
              onPress={() => openModal(item)}
              style={styles.buttonqty}>
              <Image
                style={styles.addqtyimg}
                source={require('../../../assets/qty.png')}
              />
              <Text>ADD QTY</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <FlatList
        data={selectedDetails}
        renderItem={renderProductItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={styles.flatListContainer}
      />
      <ModalComponent
        modalVisible={modalVisible}
        closeModal={() => setModalVisible(false)}
        selectedItem={selectedItem}
      />
    </>
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
    paddingVertical: 5,
    marginLeft: 5,
  },
  detailsContainer: {
    width: '50%',
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
  },
  additionalDetailsContainer: {
    paddingTop: 5,
  },
  notesContainer: {
    paddingVertical: 5,
  },
  buttonsContainer: {
    // flexDirection: 'row',
    marginTop: 5,
    // alignItems: 'center',
    justifyContent: 'center',
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
    justifyContent: 'center'
  },
  addqtyimg: {
    height: 20,
    width: 20
  },
  flatListContainer: {
    paddingHorizontal: 8,
  },
});

export default AllCategoriesListed;
