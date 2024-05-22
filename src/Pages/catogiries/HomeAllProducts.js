import React, { useState, useEffect, useRef, useCallback, PureComponent } from 'react';
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

class ProductItem extends PureComponent {
  render() {
    const { item, navigation, openModal } = this.props;
    return (
      <TouchableOpacity
        style={styles.productItem}
        onPress={() =>
          navigation.navigate(
            item.categoryId === PRODUCT_DETAILS ? 'AllCategoriesListed' : 'Details',
            {
              item,
            }
          )
        }>
        <View style={styles.productImageContainer}>
          {item.imageUrls && item.imageUrls.length > 0 ? (
            <Image style={styles.productImage} source={{ uri: item.imageUrls[0] }} />
          ) : (
            <View style={[styles.productImage, { backgroundColor: '#D3D3D3' }]} />
          )}
          <Text
            style={[
              styles.productName,
              item.imageUrls && item.imageUrls.length > 0 && { backgroundColor: 'rgba(0, 0, 0, 0.2)' },
            ]}>
            {item.styleName}
          </Text>
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
    );
  }
}

const HomeAllProducts = ({ navigation }) => {
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0); // New state for total items
  const [isFetching, setIsFetching] = useState(false);
  const flatListRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    getAllProducts();
  }, []);

  useEffect(() => {
    setFilteredProducts(
      selectedDetails.filter(item =>
        item.styleName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, selectedDetails]);

  const getAllProducts = async () => {
    if (isFetching) return;

    setIsFetching(true);
    setIsLoading(true);
    const userData = await AsyncStorage.getItem('userdata');
    const token = JSON.parse(userData);

    let json = {
      pageNo: String(pageNo),
      pageSize: '10', // Change this to your desired page size
      categoryId: '',
    };

    let allProductsApi = await Apicall.getAllProducts(token.access_token, json);
    setIsLoading(false);

    if (allProductsApi && allProductsApi.data) {
      if (allProductsApi.data.error) {
        // Handle error
      } else {
        if (pageNo === 1) {
          setSelectedDetails(allProductsApi.data.content);
          setTotalItems(allProductsApi.data.totalItems); // Set total items from API response
        } else {
          setSelectedDetails(prev => [...prev, ...allProductsApi.data.content]);
        }
        setTotalPages(allProductsApi.data.totalPages);
      }
    } else if (allProductsApi && allProductsApi.error) {
      // Handle error
      console.log('error ', allProductsApi.error);
    } else {
      // Handle error
    }

    setIsFetching(false);
  };

  const toggleSearchInput = () => {
    setShowSearchInput(!showSearchInput);
    if (showSearchInput) {
      setSearchQuery('');
    }
  };

  const openModal = item => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const renderProductItem = useCallback(
    ({ item }) => (
      <ProductItem
        item={item}
        navigation={navigation}
        openModal={openModal}
      />
    ),
    [navigation]
  );

  const handleEndReached = () => {
    if (pageNo < totalPages && !isFetching) {
      setPageNo(pageNo + 1);
    }
  };

  useEffect(() => {
    if (pageNo > 1) {
      getAllProducts();
    }
  }, [pageNo]);

  const handleScroll = event => {
    setScrollPosition(event.nativeEvent.contentOffset.y);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        {showSearchInput ? (
          <TextInput
            style={[styles.searchInput, searchQuery.length > 0 && styles.searchInputActive]}
            autoFocus={true}
            value={searchQuery}
            onChangeText={text => setSearchQuery(text)}
            placeholder="Search"
            placeholderTextColor="#000"
          />
        ) : (
          <Text style={styles.text}>
            {searchQuery ? searchQuery : (totalItems ? totalItems + ' Products Listed' : '')}
          </Text>
        )}
        <TouchableOpacity style={styles.searchButton} onPress={toggleSearchInput}>
          <Image
            style={styles.image}
            source={
              showSearchInput
                ? require('../../../assets/close.png')
                : require('../../../assets/search.png')
            }
          />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          size="large"
          color="#390050"
        />
      ) : (
        <FlatList
          ref={flatListRef}
          data={searchQuery ? filteredProducts : selectedDetails}
          renderItem={renderProductItem}
          keyExtractor={item => item.styleId.toString()}
          numColumns={2}
          contentContainerStyle={styles.productList}
          removeClippedSubviews={true}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={100}
          windowSize={7}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.1}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          getItemLayout={(data, index) => ({ length: 350, offset: 350 * index, index })}
          onContentSizeChange={() => {
            if (scrollPosition !== 0) {
              flatListRef.current.scrollToOffset({ offset: scrollPosition, animated: false });
            }
          }}
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
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  searchInputActive: {
    color: '#000',
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
    padding: 5,
  },
  additionalDetailsContainer: {
    paddingTop: 5,
  },
  notesContainer: {
    paddingVertical: 5,
  },
  buttonqty: {
    marginHorizontal:3,
    marginVertical:3,
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default HomeAllProducts;
