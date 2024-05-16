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
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {useDispatch, useSelector} from 'react-redux';
import {addItemToCart, updateCartItem} from '../redux/actions/Actions';
import axios from 'axios';
import {API} from '../config/apiConfig';

const dynamicPart = 0; // Need to change this as a dynamic

const ModalComponent = ({modalVisible, closeModal, selectedItem,inputValuess, onInputValueChange}) => {
  // console.log('Modal selectedItem:', selectedItem);
  const [selectedItemState, setSelectedItem] = useState(selectedItem);
  const [keyboardSpace, setKeyboardSpace] = useState(0);
  const [stylesData, setStylesData] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [loading, setLoading] = useState(false); // Loading state

  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cartItems);

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
          updatedItem[sizeDesc] = ''; // Clear the quantity
        });
      }
    });

    // console.log('After clearing:', updatedItem); // Log after clearing
    setSelectedItem(updatedItem);
    setInputValues({}); // Clear inputValues as well
  };

  // console.log('inputValue:', JSON.stringify(inputValues));

  const handleSaveItem = () => {
    // console.log("item",selectedItem)
    const sizeDesc = selectedItemState?.selectedSize || 'Default Size';
    const inputValue = inputValues[sizeDesc] || '';
    const itemWithDetails = {
      styleId: selectedItem.styleId,
      styleDesc: selectedItem.styleDesc,
      sizeDesc: sizeDesc,
      price: selectedItem.mrp,
      discount: selectedItem.discount,
      inputValue: inputValues,
      quantity: Object.values(inputValues).reduce(
        (acc, cur) => acc + Number(cur),
        0,
      ),
      imageUrls: selectedItem.imageUrls,
      styleName: selectedItem.styleName,
      colorName: selectedItem.colorName,
      colorId: stylesData[0]?.colorId || '', // Add colorId here
    };
    const existingItemIndex = cartItems.findIndex(
      item =>
        item.styleId === selectedItem.styleId &&
        item.sizeDesc === sizeDesc &&
        item.colorName === selectedItem.colorName,
    );
    
    if (existingItemIndex !== -1) {
      // If item exists in cart, update its quantity
      dispatch(updateCartItem(existingItemIndex, 'inputValue', inputValues));
    } else {
      // Otherwise, add it to the cart
      dispatch(addItemToCart(itemWithDetails));
    }
    closeModal();
    setInputValues({});
  };

  const handleQuantityChange = (text, index) => {
    if (stylesData.length > index && stylesData[index].sizeList) {
      const updatedItem = {...selectedItemState};
      const sizeDesc = stylesData[index].sizeList[index].sizeDesc; // Get sizeDesc from styleList
      updatedItem.selectedSize = sizeDesc; // Update selectedSize
      updatedItem[sizeDesc] = text;
      setSelectedItem(updatedItem);
      // console.log('Selected size:', sizeDesc); // Log selected size
    }
  };

  const getQuantityStyles = () => {
    setLoading(true); // Show loading indicator
    const apiUrl = `${API.STYLE_QUNTITY_DATA}/${selectedItem.styleId}/${dynamicPart}`;
    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${global.userData.access_token}`,
        },
      })
      .then(response => {
        setStylesData(response?.data?.response?.stylesList || []);
      })
      .catch(error => {
        console.error('Error:', error);
      })
      .finally(() => {
        setLoading(false); // Hide loading indicator
      });
  };

  const copyValueToClipboard = () => {
    const copiedText = inputValues[stylesData[0]?.sizeList[0]?.sizeDesc] || ''; // Get the value from the first TextInput
    Clipboard.setString(copiedText); // Copy text to clipboard
    const updatedItem = {...selectedItemState};
    const updatedInputValues = {...inputValues};

    stylesData.forEach(style => {
      if (style.sizeList) {
        style.sizeList.forEach(size => {
          const sizeDesc = size.sizeDesc;
          updatedItem[sizeDesc] = copiedText; // Set the same text to all other TextInputs
          updatedInputValues[sizeDesc] = copiedText; // Update input values as well
        });
      }
    });

    setSelectedItem(updatedItem); // Update the state
    setInputValues(updatedInputValues); // Update input values
  };

  // console.log('selectedItem:', selectedItem);
  // console.log('inputValue:', inputValues);

  return (
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
        keyboardShouldPersistTaps="handled">
        <View style={styles.modalContent}>
          <View style={styles.addqtyhead}>
            <Text style={styles.addqtytxt}>Add Quantity</Text>
          </View>

          <View style={styles.sizehead}>
            <Text style={styles.sizetxt}>Size/Color</Text>
            <Text style={styles.quantitytxt}>Quantity</Text>
            <Text style={styles.quantitytxt}>Price</Text>
          </View>
          {loading ? (
            <ActivityIndicator color="#390050" style={{marginTop: 10}} /> // Show ActivityIndicator if loading
          ) : (
            <ScrollView style={{maxHeight: '70%'}}>
              {stylesData &&
                stylesData.map((style, index) => (
                  <View key={index} style={{marginBottom: 10}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginHorizontal: 5,
                        marginTop:5
                      }}>
                      <View>
                      <Text>ColorName - {selectedItem ? selectedItem.colorName : ''}</Text>
                      </View>
                      <TouchableOpacity
                        style={{
                          borderWidth: 1,
                          borderColor: '#fff',
                          borderRadius: 30,
                          paddingHorizontal: 4,
                          marginLeft: 'auto',
                        }}
                        onPress={() =>
                          copyValueToClipboard(
                            selectedItemState[
                              stylesData[0]?.sizeList[0]?.sizeDesc
                            ],
                          )
                        }>
                        <Image
                          style={{height: 30, width: 30}}
                          source={require('../../assets/copy.png')}
                        />
                      </TouchableOpacity>
                    </View>

                    {style.sizeList &&
                      style.sizeList.map((size, sizeIndex) => (
                        <View
                          key={sizeIndex}
                          style={{flexDirection: 'row', marginRight: 10}}>
                          <View style={{flex: 1}}>
                            <Text style={{marginTop: 15, marginHorizontal: 5}}>
                              {style.styleDesc}
                            </Text>
                            <Text style={{marginTop: 2, marginHorizontal: 5}}>
                              Size - {size.sizeDesc}
                            </Text>
                            {/* <Text>colorId{style.colorId}</Text> */}
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              flex: 1.7,
                            }}>
                            <TextInput
                              style={{
                                flex: 0.4,
                                borderBottomWidth: 1,
                                borderColor: 'gray',
                                textAlign: 'center',
                                color: '#000',
                              }}
                              keyboardType="numeric"
                              value={
                                inputValues[size.sizeDesc] !== undefined
                                  ? inputValues[size.sizeDesc]
                                  : ''
                              }
                              onChangeText={text => {
                                const updatedInputValues = {...inputValues};
                                updatedInputValues[size.sizeDesc] = text;
                                setInputValues(updatedInputValues);
                                handleQuantityChange(text, index); // Pass index instead of sizeDesc
                              }}
                            />
                            <View style={{flex: 0.4}}>
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
              <Text style={{color: 'white', fontWeight: 'bold'}}>
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
              <Text style={{color: 'white', fontWeight: 'bold'}}>SAVE</Text>
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
  },
  addqtytxt: {
    color: 'white',
    fontWeight: 'bold',
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
    flex: 0.6,
    color: '#000',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  quantitytxt: {
    color: '#000',
    fontWeight: 'bold',
    flex: 0.4,
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
