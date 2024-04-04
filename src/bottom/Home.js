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
  Clipboard,
} from 'react-native';
import {PRODUCT_DETAILS} from '../components/ProductDetails';
import {AllPRODUCT_DETAILS} from '../components/AllProductDetails';
import {useDispatch} from 'react-redux';
import {addItemToCart, removeItemFromCart} from '../redux/action/Action';

const ProductRow = ({
  label,
  copyImageSource,
  quantity,
  handleQuantityChange,
  value1,
  value2,
  value3,
  setExtraSmallQuantity,
  setSmallQuantity,
  setMediumQuantity,
  setLargeQuantity,
  setExtraLargeQuantity,
  setDoubleLargeQuantity,
  setTribleLargeQuantity,
  setFiveLargeQuantity,
}) => {
  const copyValueToClipboard = () => {
    // Copy the value to all quantities
    setExtraSmallQuantity(quantity);
    setSmallQuantity(quantity);
    setMediumQuantity(quantity);
    setLargeQuantity(quantity);
    setExtraLargeQuantity(quantity);
    setDoubleLargeQuantity(quantity);
    setTribleLargeQuantity(quantity);
    setFiveLargeQuantity(quantity);

    Clipboard.setString(quantity);
  };

  return (
    <View style={styles.rowContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={{textAlign: 'center'}} // Center the text horizontally
          keyboardType="numeric"
          value={quantity}
          onChangeText={handleQuantityChange}
        />
        <View style={styles.underline}></View>
      </View>
      <View style={styles.spaceBetweenContainer}>
        <Text style={{alignItems: 'center', marginLeft: 40}}>{value1}</Text>
        <Text style={{alignItems: 'center', marginLeft: 10}}>{value2}</Text>
        <Text style={{alignItems: 'center', marginLeft: 10}}>{value3}</Text>
        <TouchableOpacity onPress={copyValueToClipboard}>
          <Image style={{height: 20, width: 20}} source={copyImageSource} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Home = ({navigation}) => {
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(PRODUCT_DETAILS);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [keyboardSpace, setKeyboardSpace] = useState(0);
  const [extraSmallQuantity, setExtraSmallQuantity] = useState('');
  const [smallQuantity, setSmallQuantity] = useState('');
  const [mediumQuantity, setMediumQuantity] = useState('');
  const [largeQuantity, setLargeQuantity] = useState('');
  const [extralargeQuantity, setExtraLargeQuantity] = useState('');
  const [doublelargeQuantity, setDoubleLargeQuantity] = useState('');
  const [triblelargeQuantity, setTribleLargeQuantity] = useState('');
  const [fivelargeQuantity, setFiveLargeQuantity] = useState('');
  const [wishlist, setWishlist] = useState({});

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      event => {
        setKeyboardSpace(event.endCoordinates.height);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardSpace(0);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const clearAllInputs = () => {
    setExtraSmallQuantity('');
    setSmallQuantity('');
    setMediumQuantity('');
    setLargeQuantity('');
    setExtraLargeQuantity('');
    setDoubleLargeQuantity('');
    setTribleLargeQuantity('');
    setFiveLargeQuantity('');
  };
  const dispatch = useDispatch();

  const toggleWishlist = item => {
    const itemInWishlist = isInWishlist(item);
    if (itemInWishlist) {
      // Item exists in the wishlist, remove it
      dispatch(removeItemFromCart(item.id));
      setWishlist(prevWishlist => {
        const {[item.id]: removedItem, ...updatedWishlist} = prevWishlist;
        return updatedWishlist;
      });
    } else {
      // Item does not exist in the wishlist, add it
      dispatch(addItemToCart(item));
      setWishlist(prevWishlist => {
        return {...prevWishlist, [item.id]: item};
      });
    }
  };

  const isInWishlist = item => {
    return !!wishlist[item.id];
  };

  const toggleSearchInput = () => {
    setShowSearchInput(!showSearchInput);
  };

  const handleCategoryPress = details => {
    setSelectedDetails(details);
  };

  const addItem = item => {
    dispatch(addItemToCart(item));
  };

  const openModal = item => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const onFocusTextInput = () => {
    setModalVisible(true);
  };

  const onBlurTextInput = () => {
    // You may add additional logic here if needed
  };

  const handleExtraSmallQuantityChange = text => {
    setExtraSmallQuantity(text);
  };

  const handleSmallQuantityChange = text => {
    setSmallQuantity(text);
  };
  const handleMediumQuantityChange = text => {
    setMediumQuantity(text);
  };
  const handleLargeQuantityChange = text => {
    setLargeQuantity(text);
  };
  const handleExtraQuantityChange = text => {
    setExtraLargeQuantity(text);
  };
  const handlDoubleQuantityChange = text => {
    setDoubleLargeQuantity(text);
  };
  const handleTribleQuantityChange = text => {
    setTribleLargeQuantity(text);
  };
  const handleFiveQuantityChange = text => {
    setFiveLargeQuantity(text);
  };
  const renderProductItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.productItem}
        onPress={() =>
          selectedDetails === PRODUCT_DETAILS
            ? navigation.navigate('AllCategoriesListed', {
                item,
                name: item.name,
                image: item.image,
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
                tags: item.tags,
                set: item.set,
              })
        }>
        <View style={styles.productImageContainer}>
          {item.image && (
            <Image style={styles.productImage} source={item.image} />
          )}
          <Text style={styles.productName}>{item.name}</Text>
        </View>
        {selectedDetails === AllPRODUCT_DETAILS && (
          <View style={styles.additionalDetailsContainer}>
            <Text>Price: {item.price}</Text>
            <Text>Tags: {item.tags}</Text>
            <View style={styles.notesContainer}>
              <Text>Notes: {item.disription}</Text>
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  onPress={() => toggleWishlist(item)} // Toggle wishlist status
                  style={[
                    styles.button,
                    isInWishlist(item) && {backgroundColor: '#FF817E'}, // Change button style if item is in wishlist
                  ]}>
                  <Image
                    style={{height: 20, width: 20}}
                    source={require('../../assets/heart.png')}
                  />
                  <Text>WISHLIST</Text>
                </TouchableOpacity>
                <View style={{marginHorizontal: 4}} /> {/* Add space */}
                <TouchableOpacity
                  onPress={() => openModal(item)}
                  style={styles.buttonqty}>
                  <Image
                    style={{height: 20, width: 20}}
                    source={require('../../assets/qty.png')}
                  />
                  <Text>ADD QTY</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <TouchableOpacity
          style={[
            styles.title,
            selectedDetails === PRODUCT_DETAILS ? styles.activeCategory : null,
          ]}
          onPress={() => handleCategoryPress(PRODUCT_DETAILS)}>
          <Text
            style={
              selectedDetails === PRODUCT_DETAILS ? styles.activeText : null
            }>
            CATEGORIES
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.titleOne,
            selectedDetails === AllPRODUCT_DETAILS
              ? styles.activeCategory
              : null,
          ]}
          onPress={() => handleCategoryPress(AllPRODUCT_DETAILS)}>
          <Text
            style={
              selectedDetails === AllPRODUCT_DETAILS ? styles.activeText : null
            }>
            ALL PRODUCTS
          </Text>
        </TouchableOpacity>
      </View>

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
          <Text style={styles.text}>6 Categories Listed</Text>
        )}
        <TouchableOpacity
          style={styles.searchButton}
          onPress={toggleSearchInput}>
          <Image
            style={styles.image}
            source={require('../../assets/search.png')}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        data={selectedDetails}
        renderItem={renderProductItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.productList}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <ScrollView
          contentContainerStyle={[
            styles.modalContainer,
            {marginBottom: keyboardSpace},
          ]}
          keyboardShouldPersistTaps="handled" // Add this line
        >
          <View style={styles.modalContent}>
            <View style={{backgroundColor: 'green', padding: 10}}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>
                Add Quantity
              </Text>
            </View>

            <View
              style={{
                padding: 1,
                backgroundColor: '#E7E7E7',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={{marginLeft: 5, color: '#000', fontWeight: 'bold'}}>
                Size/Color
              </Text>
              <Text style={{color: '#000', fontWeight: 'bold'}}>Quantity</Text>
              <Text style={{color: '#000', fontWeight: 'bold'}}>Price</Text>
              <Text style={{color: '#000', fontWeight: 'bold'}}>
                1day {'\n'}stock
              </Text>
              <Text
                style={{marginRight: 50, color: '#000', fontWeight: 'bold'}}>
                3day {'\n'}stock
              </Text>
            </View>
            {selectedItem && (
              <View style={{marginHorizontal: 10, marginVertical: 10}}>
                <Text style={{color: '#000', fontWeight: 'bold'}}>
                  {selectedItem.name}
                </Text>
              </View>
            )}
            {/* ProductRows wrapped in ScrollView */}
            <ScrollView style={{maxHeight: '70%'}}>
              {/* Your ProductRows here */}
              <ProductRow
                label=".Extra Small"
                copyImageSource={require('../../assets/copy.png')}
                quantity={extraSmallQuantity}
                handleQuantityChange={handleExtraSmallQuantityChange}
                value1="365" // Dynamic value
                value2="N/A" // Dynamic value
                value3="N/A"
                setExtraSmallQuantity={setExtraSmallQuantity}
                setSmallQuantity={setSmallQuantity}
                setMediumQuantity={setMediumQuantity}
                setLargeQuantity={setLargeQuantity}
                setExtraLargeQuantity={setExtraLargeQuantity}
                setDoubleLargeQuantity={setDoubleLargeQuantity}
                setTribleLargeQuantity={setTribleLargeQuantity}
                setFiveLargeQuantity={setFiveLargeQuantity}
              />

              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: 'gray',
                }}></View>
              <ProductRow
                label="1.Small"
                quantity={smallQuantity}
                handleQuantityChange={handleSmallQuantityChange}
                value1="365"
                value2="N/A"
                value3="N/A"
              />
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: 'gray',
                }}></View>
              <ProductRow
                label="2.Medium"
                quantity={mediumQuantity}
                handleQuantityChange={handleMediumQuantityChange}
                value1="145"
                value2="61"
                value3="4"
              />
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: 'gray',
                }}></View>
              <ProductRow
                label="3.Large"
                quantity={largeQuantity}
                handleQuantityChange={handleLargeQuantityChange}
                value1="145"
                value2="61"
                value3="4"
              />
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: 'gray',
                }}></View>
              <ProductRow
                label="4.Extra Large"
                quantity={extralargeQuantity}
                handleQuantityChange={handleExtraQuantityChange}
                value1="145"
                value2="61"
                value3="4"
              />
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: 'gray',
                }}></View>
              <ProductRow
                label="5.2x Large"
                quantity={doublelargeQuantity}
                handleQuantityChange={handlDoubleQuantityChange}
                value1="145"
                value2="61"
                value3="4"
              />
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: 'gray',
                }}></View>
              <ProductRow
                label="6.3x Large"
                quantity={triblelargeQuantity}
                handleQuantityChange={handleTribleQuantityChange}
                value1="145"
                value2="61"
                value3="4"
              />
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: 'gray',
                }}></View>
              <ProductRow
                label="7.5x Large"
                quantity={fivelargeQuantity}
                handleQuantityChange={handleFiveQuantityChange}
                value1="145"
                value2="61"
                value3="4"
              />
              <View
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: 'gray',
                }}></View>
            </ScrollView>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginRight: 20,
                marginTop: 20,
                marginBottom: 30,
              }}>
              <TouchableOpacity
                onPress={clearAllInputs} // Add this line
                style={{
                  borderWidth: 1,
                  borderColor: '#000',
                  backgroundColor: '#D4A017',
                  marginLeft: 10,
                  paddingVertical: 10,
                  paddingHorizontal: 10,
                  borderRadius: 5,
                }}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>
                  CLEAR ALL
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  addItem(selectedItem); // Add selectedItem to the cart
                  closeModal(); // Close modal after adding item
                }}
                style={{
                  borderWidth: 1,
                  borderColor: '#000',
                  backgroundColor: 'green',
                  marginLeft: 10,
                  paddingVertical: 10,
                  paddingHorizontal: 35,
                  borderRadius: 5,
                }}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>SAVE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  head: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    paddingHorizontal: 45,
    marginLeft: 30,
  },
  titleOne: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 10,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 45,
    marginRight: 30,
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
    marginTop: 5,
    alignItems: 'center',
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

export default Home;
