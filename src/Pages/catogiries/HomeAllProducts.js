import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Keyboard,
  Platform,
  ScrollView,
  Alert
} from 'react-native';


import {useDispatch, useSelector} from 'react-redux';
import {API} from '../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Apicall from './../../utils/serviceApi/serviceAPIComponent';
import LoaderComponent from '../../utils/loaderComponent/loaderComponent';
import { addItemToCart } from '../../redux/actions/Actions';
import { PRODUCT_DETAILS } from '../../components/ProductDetails';
import { AllPRODUCT_DETAILS } from '../../components/AllProductDetails';
import ModalComponent from '../../components/ModelComponent';

const HomeAllProducts = ({navigation}) => {
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(undefined);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {

    getAllProducts()
  }, []);

  const getAllProducts = async () => {

    const userData = await AsyncStorage.getItem('userdata');
    const token = JSON.parse(userData)

    let json = {
      "pageNo": "1",
      "pageSize": "10",
      "categoryId": ""
    }

    setIsLoading(true);
    let allProductsApi = await Apicall.getAllProducts(token.access_token,json);
    setIsLoading(false);

    if(allProductsApi && allProductsApi.data) {
      if(allProductsApi.data.error) {
        // Show the Alert for failure with description
      } else {
        setSelectedDetails(allProductsApi.data.content);
      }

    } else if(allProductsApi && allProductsApi.error) {
      // Show the Alert for failure with description
      console.log('error ', allProductsApi.error)
    } else {
      // Show the Alert for failure
    }

  };

  const handleAddToCart = item => {
    dispatch(addItemToCart(item)); // Dispatch the action with the item data
  };

  const toggleSearchInput = () => {
    setShowSearchInput(!showSearchInput);
  };

  const handleCategoryPress = details => {
    // setSelectedDetails(details);
  };

  const openModal = item => {
    // console.log('openModal called with item:', item); // Add console log statement to check item
    setSelectedItem(item);
    setModalVisible(true);
  };

 
  const onFocusTextInput = () => {
    setModalVisible(true);
  };

  const renderProductItem = ({item, onAddToCart}) => {
    // console.log('Item ', item)
    return (
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
                name: item.styleName,
                disription: item.disription,
                tags: item.tags,
                set: item.set,
              })
        }
        >

        <View style={styles.productImageContainer}>
          {item.imageUrls && item.imageUrls.length > 0 ? <Image style={styles.productImage} source={{uri:item.imageUrls[0]}} /> : <View style={[styles.productImage,{backgroundColor:'#D3D3D3'}]}></View>}
          <Text style={styles.productName}>{item.colorName}</Text>
        </View>

          <View style={styles.additionalDetailsContainer}>
            <Text>Price: {item.mrp}</Text>
            <Text>Name: {item.styleName}</Text>
            <View style={styles.notesContainer}>
            <Text>Discription: {item.styleDesc}</Text>
              <View style={styles.buttonsContainer}>
                {/* <TouchableOpacity style={[styles.button]}>
                  <Image
                    style={{height: 20, width: 20}}
                    source={require('../../assets/heart.png')}
                  />
                  <Text>WISHLIST</Text>
                </TouchableOpacity> */}
                <View style={{}} />
                <TouchableOpacity
                  onPress={() => openModal(item)} // Pass the item to openModal
                  style={styles.buttonqty}>
                  <Image
                    style={{height: 20, width: 20}}
                    source={require('../../../assets/qty.png')}
                  />
                  <Text>ADD QTY</Text>
                </TouchableOpacity>
              </View>
            </View>
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

      <FlatList
        data={selectedDetails}
        renderItem={({item}) =>
          renderProductItem({item, onAddToCart: handleAddToCart})
        } // Pass handleAddToCart function here
        keyExtractor={item => item.styleId}
        numColumns={2}
        contentContainerStyle={styles.productList}
      />
      <ModalComponent
        modalVisible={modalVisible}
        closeModal={() => setModalVisible(false)}
        selectedItem={selectedItem} // Add this line to pass selectedItem
      />

    {isLoading ? <LoaderComponent loaderText={'Please wait..'} /> : null}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop:10
  },
  head: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems:"center",
    justifyContent:"center",
  },
  titleContainer: {
    alignItems:"center",
    justifyContent:"center",
  },
  title: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 10,
    borderBottomLeftRadius:20,
    borderTopLeftRadius:20
  },
  titleone: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 10,
    borderBottomRightRadius:20,
    borderTopRightRadius:20,
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
    // backgroundColor:'red'
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
    justifyContent:'center'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    flex: 0.3,
    marginTop: 10,
    color: '#000',
    fontWeight: 'bold',
  },
  inputContainer: {
    flex: 0.2,
    marginLeft: 30,
  },
  spaceBetweenContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  underline: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
});

export default HomeAllProducts;
