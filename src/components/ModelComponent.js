import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  Keyboard,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {useDispatch, useSelector} from 'react-redux';
import {addItemToCart, updateCartItem} from '../redux/actions/Actions';
import axios from 'axios';
import {API} from '../config/apiConfig';

const dynamicPart = 0; // Need to change this as a dynamic

const ModalComponent = ({
  modalVisible,
  closeModal,
  selectedItem,
  inputValuess,
  onInputValueChange,
  isDarkTheme,
}) => {
  // console.log('Modal selectedItem:', selectedItem);
  const [selectedItemState, setSelectedItem] = useState(selectedItem);
  const [keyboardSpace, setKeyboardSpace] = useState(0);
  const [stylesData, setStylesData] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [loading, setLoading] = useState(false); // Loading state

  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cartItems);

  const textInputStyle = {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    flex: 0.4,
    color: isDarkTheme ? '#fff' : '#000', // Change text color based on theme
  };

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

  useEffect(() => {
    // console.log('selectedItem:', selectedItem);
    if (selectedItem) {
      getQuantityStyles();
    }
  }, [selectedItem]);

  const clearAllInputs = () => {
    const updatedItem = {...selectedItemState};
    console.log('Before clearing:', updatedItem); // Log before clearing

    stylesData.forEach(style => {
      if (style.sizeList) {
        style.sizeList.forEach(size => {
          const sizeDesc = size.sizeDesc;
          updatedItem[sizeDesc] = ''; // Clear the quantity to an empty string
        });
      }
    });

    // Log after clearing
    console.log('After clearing:', updatedItem);
    setSelectedItem(updatedItem);
    setInputValues({}); // Clear inputValues as well
  };

  // console.log('inputValue:', JSON.stringify(inputValues));

  const handleSaveItem = () => {
    let itemsToUpdate = [];
  
    stylesData.forEach(style => {
      if (!style.sizeList || style.sizeList.length === 0) return;
  
      style.sizeList.forEach(size => {
        const sizeDesc = size.sizeDesc;
        const inputValue = inputValues[sizeDesc] || '0'; // Ensure a default value of '0'
  
        if (parseInt(inputValue, 10) > 0) {
          const itemBaseDetails = {
            availQty: style.availQty,
            color: style.color,
            colorId: style.colorId,
            styleId: style.styleId,
            styleDesc: style.styleDesc,
            price: style.price,
            discount: style.styleDiscountRequest
              ? style.styleDiscountRequest.discountName
              : '',
            imageUrls: style.imageUrls,
            styleName: style.styleName,
            colorName: size.colorName,
            sizeDesc: sizeDesc,
            sizeId: size.sizeId,
            quantity: inputValue,
          };
  
          const existingItemIndex = cartItems.findIndex(
            item =>
              item.styleId === style.styleId &&
              item.colorId === style.colorId &&
              item.sizeId === size.sizeId,
          );
  
          if (existingItemIndex !== -1) {
            // Update existing item quantity
            const updatedQuantity = parseInt(inputValue, 10);
            const updatedItem = {
              ...cartItems[existingItemIndex],
              quantity: updatedQuantity.toString(),
            };
            console.log(
              `Updating existing item at index ${existingItemIndex} with quantity ${updatedItem.quantity}`,
            );
            dispatch(updateCartItem(existingItemIndex, updatedItem));
          } else {
            // Add new item to update list
            itemsToUpdate.push(itemBaseDetails);
          }
        }
      });
    });
  
    // Add items to cart only if itemsToUpdate is not empty
    if (itemsToUpdate.length > 0) {
      itemsToUpdate.forEach(item => dispatch(addItemToCart(item)));
    }
  
    clearAllInputs();
    closeModal();
  };
  

  useEffect(() => {
    if (modalVisible && stylesData.length > 0) {
      const initialInputValues = {};
      stylesData.forEach(style => {
        if (style.sizeList) {
          style.sizeList.forEach(size => {
            const sizeDesc = size.sizeDesc;
            // Initialize inputValues with quantities from cartItems
            const cartItem = cartItems.find(
              item =>
                item.styleId === style.styleId &&
                item.colorId === style.colorId &&
                item.sizeId === size.sizeId,
            );
            if (cartItem) {
              initialInputValues[sizeDesc] = cartItem.quantity.toString();
            } else {
              initialInputValues[sizeDesc] = '';
            }
          });
        }
      });
      setInputValues(initialInputValues);
    }
  }, [modalVisible, stylesData]);
  

  const handleQuantityChange = (text, styleIndex, sizeIndex) => {
    console.log('Text:', text);
    console.log('Style Index:', styleIndex);
    console.log('Size Index:', sizeIndex);

    const sizeList = stylesData[styleIndex]?.sizeList || [];
    const sizeDesc = sizeList[sizeIndex]?.sizeDesc;

    if (sizeDesc) {
      const updatedItem = {...selectedItemState, [sizeDesc]: text};
      setSelectedItem(updatedItem);
      console.log('Selected size:', sizeDesc);

      const updatedInputValues = {...inputValues, [sizeDesc]: text};
      setInputValues(updatedInputValues);
    }
  };

  const getQuantityStyles = () => {
    setLoading(true); // Show loading indicator
    const apiUrl = `${global?.userData?.productURL}${API.STYLE_QUNTITY_DATA}/${selectedItem.styleId}/${dynamicPart}`;
    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${global.userData.token.access_token}`,
        },
      })
      .then(response => {
        setStylesData(response?.data?.response?.stylesList || []);
        console.log('Styles List:', response.data?.response?.stylesList);
      })
      .catch(error => {
        console.error('Error:', error);
      })
      .finally(() => {
        setLoading(false); // Hide loading indicator
      });
  };

  const copyValueToClipboard = () => {
    if (stylesData.length > 0 && stylesData[0]?.sizeList?.length > 0) {
      const firstSizeDesc = stylesData[0].sizeList[0]?.sizeDesc;
      if (
        !inputValues[firstSizeDesc] ||
        inputValues[firstSizeDesc].trim() === ''
      ) {
        Alert.alert('Please enter the quantity before copying.');
        return;
      }

      const copiedText = inputValues[firstSizeDesc];
      Clipboard.setString(copiedText);
      const updatedItem = {...selectedItemState};
      const updatedInputValues = {...inputValues};

      stylesData.forEach(style => {
        style.sizeList.forEach(size => {
          const sizeDesc = size.sizeDesc;
          updatedItem[sizeDesc] = copiedText;
          updatedInputValues[sizeDesc] = copiedText;
        });
      });

      setSelectedItem(updatedItem);
      setInputValues(updatedInputValues);
    }
  };

  // console.log('selectedItem:', selectedItem);
  // console.log('inputValue:', inputValues);
  const handleIncrementQuantity = (styleIndex, sizeIndex) => {
    const updatedInputValues = {...inputValues};
    const sizeList = stylesData[styleIndex]?.sizeList || [];
    const sizeDesc = sizeList[sizeIndex]?.sizeDesc;
    const currentQuantity = parseInt(updatedInputValues[sizeDesc] || '0', 10);

    if (sizeDesc) {
      updatedInputValues[sizeDesc] = (currentQuantity + 1).toString();
      setInputValues(updatedInputValues);
      console.log('Updated Input Values after increment:', updatedInputValues);
    }
  };

  const handleDecrementQuantity = (styleIndex, sizeIndex) => {
    const updatedInputValues = {...inputValues};
    const sizeList = stylesData[styleIndex]?.sizeList || [];
    const sizeDesc = sizeList[sizeIndex]?.sizeDesc;
    const currentQuantity = parseInt(updatedInputValues[sizeDesc] || '0', 10);

    if (sizeDesc && currentQuantity > 0) {
      updatedInputValues[sizeDesc] = (currentQuantity - 1).toString();
      setInputValues(updatedInputValues);
      console.log('Updated Input Values after decrement:', updatedInputValues);
    }
  };

  return (
    <Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={closeModal}>
    <ScrollView
      contentContainerStyle={[
        styles.modalContainer,
        { marginBottom: keyboardSpace },
      ]}
      keyboardShouldPersistTaps="handled">
      <View style={styles.modalContent}>
        <View style={styles.addqtyhead}>
          <TouchableOpacity onPress={closeModal}>
            <Image
              style={{ height: 30, width: 30, tintColor: 'white' }}
              source={require('../../assets/back_arrow.png')}
            />
          </TouchableOpacity>
          <Text style={styles.addqtytxt}>Add Quantity</Text>
        </View>

        <View style={styles.sizehead}>
          <Text style={styles.sizetxt}>Size/Color</Text>
          <Text style={styles.quantityqty}>Quantity</Text>
          <Text style={styles.quantitytxt}>Price</Text>
          <TouchableOpacity
            style={{
              borderRadius: 30,
              paddingHorizontal: 4,
              marginLeft: 'auto',
              flex: 0.2,
            }}
            onPress={copyValueToClipboard}>
            <Image
              style={{ height: 30, width: 30 }}
              source={require('../../assets/copy.png')}
            />
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator color="#390050" style={{ marginTop: 10 }} /> // Show ActivityIndicator if loading
        ) : (
          <ScrollView style={{ maxHeight: '70%' }}>
            {stylesData &&
              stylesData.map((style, index) => (
                <View key={index} style={{ marginBottom: 10 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginHorizontal: 5,
                      marginTop: 5,
                    }}>
                    <View>
                      <Text>
                        ColorName -{' '}
                        {selectedItem ? selectedItem.colorName : ''}
                      </Text>
                    </View>
                  </View>

                  {style.sizeList &&
                    style.sizeList.map((size, sizeIndex) => (
                      <View
                        key={sizeIndex}
                        style={{ flexDirection: 'row', marginRight: 10 }}>
                        <View style={{ flex: 0.7 }}>
                          <Text style={{ marginTop: 15, marginHorizontal: 5 }}>
                            {style.styleDesc}
                          </Text>
                          <Text style={{ marginTop: 2, marginHorizontal: 5 }}>
                            Size - {size.sizeDesc}
                          </Text>
                          {/* <Text>colorId{style.colorId}</Text> */}
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flex: 1.7,
                          }}>
                          <TouchableOpacity
                            onPress={() =>
                              handleDecrementQuantity(index, sizeIndex)
                            }>
                            <Image
                              style={{ height: 25, width: 25, marginRight: 10 }}
                              source={require('../../assets/sub.jpg')}
                            />
                          </TouchableOpacity>

                          <TextInput
                            placeholderTextColor="#000"
                            style={textInputStyle}
                            keyboardType="numeric"
                            value={
                              inputValues[size.sizeDesc] !== undefined &&
                                inputValues[size.sizeDesc].trim() !== ''
                                ? inputValues[size.sizeDesc].toString()
                                : ''
                            } // Default value as empty string
                            onChangeText={text => {
                              const updatedInputValues = { ...inputValues };
                              updatedInputValues[size.sizeDesc] = text;
                              setInputValues(updatedInputValues);
                              handleQuantityChange(text, index, sizeIndex); // Pass index and sizeIndex
                            }}
                          />

                          <TouchableOpacity
                            onPress={() =>
                              handleIncrementQuantity(index, sizeIndex)
                            }>
                            <Image
                              style={{ height: 20, width: 20, marginLeft: 10 }}
                              source={require('../../assets/add.png')}
                            />
                          </TouchableOpacity>

                          <View style={{ flex: 0.4, marginLeft: 40 }}>
                            <Text>{style.price}</Text>
                          </View>
                        </View>
                      </View>
                    ))}
                </View>
              ))}
          </ScrollView>
        )}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginRight: 20,
            marginTop: 20,
            marginBottom: 30,
          }}>
          <TouchableOpacity
            onPress={() => clearAllInputs()}
            style={{
              borderWidth: 1,
              borderColor: '#000',
              backgroundColor: 'gray',
              marginLeft: 10,
              paddingVertical: 10,
              paddingHorizontal: 10,
              borderRadius: 5,
            }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              CLEAR ALL
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSaveItem}
            style={{
              borderWidth: 1,
              borderColor: '#000',
              backgroundColor: '#390050',
              marginLeft: 10,
              paddingVertical: 10,
              paddingHorizontal: 35,
              borderRadius: 5,
            }}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>SAVE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  </Modal>
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
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 45,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  titleone: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 45,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },

  activeCategory: {
    backgroundColor: '#390050',
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
  addqtyhead: {
    backgroundColor: '#390050',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addqtytxt: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  sizehead: {
    padding: 1,
    backgroundColor: '#E7E7E7',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  sizetxt: {
    flex: 0.8,
    color: '#000',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  quantitytxt: {
    color: '#000',
    fontWeight: 'bold',
    flex: 0.2,
    marginLeft: 20,
  },
  quantityqty: {
    color: '#000',
    fontWeight: 'bold',
    flex: 0.5,
  },

  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginBottom: 10,
    alignItems: 'center',
  },

  labelContainer: {
    flex: 0.4,
  },

  label: {
    color: '#000',
    fontWeight: 'bold',
  },

  copyButton: {
    position: 'absolute',
    right: 0,
  },

  copyImage: {
    height: 20,
    width: 18,
    marginHorizontal: 5,
  },

  inputContainer: {
    flex: 0.2,
  },
  underline: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
});

export default ModalComponent;