import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart } from '../redux/actions/Actions';

const ProductRow = ({
  label,
  copyImageSource,
  quantity,
  handleQuantityChange,
  item,
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
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={{ textAlign: 'center' }}
          keyboardType="numeric"
          value={quantity}
          onChangeText={handleQuantityChange}
        />
        <View style={styles.underline}></View>

      </View>
      <View style={{ flex: 0.4 }}>
        <Text style={{ alignItems: 'center', marginLeft: 50 }}>
          {item && item.mrp}
        </Text>
      </View>

      {label === ".Extra Small" && (
        <TouchableOpacity onPress={copyValueToClipboard} style={styles.copyButton}>
          <Image style={styles.copyImage} source={copyImageSource} />
        </TouchableOpacity>
      )}
    </View>

  );
};

const ModalComponent = ({ modalVisible, closeModal, selectedItem }) => {
  useEffect(() => {
    if (selectedItem) {
      setExtraSmallQuantity(selectedItem.extraSmallQuantity || '');
      setSmallQuantity(selectedItem.smallQuantity || '');
      setMediumQuantity(selectedItem.mediumQuantity || '');
      setLargeQuantity(selectedItem.largeQuantity || '');
      setExtraLargeQuantity(selectedItem.extralargeQuantity || '');
      setDoubleLargeQuantity(selectedItem.doublelargeQuantity || '');
      setTribleLargeQuantity(selectedItem.triblelargeQuantity || '');
      setFiveLargeQuantity(selectedItem.fivelargeQuantity || '');
    }
  }, [selectedItem]);

  const dispatch = useDispatch();
  const [keyboardSpace, setKeyboardSpace] = useState(0);
  const [extraSmallQuantity, setExtraSmallQuantity] = useState('');
  const [smallQuantity, setSmallQuantity] = useState('');
  const [mediumQuantity, setMediumQuantity] = useState('');
  const [largeQuantity, setLargeQuantity] = useState('');
  const [extralargeQuantity, setExtraLargeQuantity] = useState('');
  const [doublelargeQuantity, setDoubleLargeQuantity] = useState('');
  const [triblelargeQuantity, setTribleLargeQuantity] = useState('');
  const [fivelargeQuantity, setFiveLargeQuantity] = useState('');
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
  const handleSaveItem = () => {
    console.log('handleSaveItem called');
    console.log('selectedItem:', selectedItem);
    if (selectedItem) {
      const itemWithQuantity = {
        ...selectedItem,
        extraSmallQuantity,
        smallQuantity,
        mediumQuantity,
        largeQuantity,
        extralargeQuantity,
        doublelargeQuantity,
        triblelargeQuantity,
        fivelargeQuantity,
      };
      console.log('Item with Quantity:', itemWithQuantity);
      dispatch(addItemToCart(itemWithQuantity));
      closeModal();
    } else {
      console.log('No selectedItem found!');
    }
  };

  const handleAddToCart = item => {
    dispatch(addItemToCart(item));
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

  const onFocusTextInput = () => {
    setModalVisible(true);
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
            <Text style={styles.addqtytxt}>
              Add Quantity
            </Text>
          </View>

          <View
            style={styles.sizehead}>
            <Text style={styles.sizetxt}>
              Size/Color
            </Text>
            <Text style={styles.quantitytxt}>Quantity</Text>
            <Text style={styles.quantitytxt}>Price</Text>
          </View>
          {selectedItem && (
            <View style={styles.selectedItemhead}>
              <Text style={styles.selectedItemtext}>
                {selectedItem.name}
              </Text>
            </View>
          )}
          <ScrollView style={{ maxHeight: '70%' }}>
            <ProductRow
              item={selectedItem}
              label=".Extra Small"
              copyImageSource={require('../../assets/copy.png')}
              quantity={extraSmallQuantity}
              handleQuantityChange={handleExtraSmallQuantityChange}
              value2="N/A"
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
              item={selectedItem}
              label="1.Small"
              quantity={smallQuantity}
              handleQuantityChange={handleSmallQuantityChange}
            />
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: 'gray',
              }}></View>
            <ProductRow
              item={selectedItem}
              label="2.Medium"
              quantity={mediumQuantity}
              handleQuantityChange={handleMediumQuantityChange}
            />
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: 'gray',
              }}></View>
            <ProductRow
              item={selectedItem}
              label="3.Large"
              quantity={largeQuantity}
              handleQuantityChange={handleLargeQuantityChange}
            />
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: 'gray',
              }}></View>
            <ProductRow
              item={selectedItem}
              label="4.Extra Large"
              quantity={extralargeQuantity}
              handleQuantityChange={handleExtraQuantityChange}
            />
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: 'gray',
              }}></View>
            <ProductRow
              item={selectedItem}
              label="5.2x Large"
              quantity={doublelargeQuantity}
              handleQuantityChange={handlDoubleQuantityChange}
            />
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: 'gray',
              }}></View>
            <ProductRow
              item={selectedItem}
              label="6.3x Large"
              quantity={triblelargeQuantity}
              handleQuantityChange={handleTribleQuantityChange}
            />
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: 'gray',
              }}></View>
            <ProductRow
              item={selectedItem}
              label="7.5x Large"
              quantity={fivelargeQuantity}
              handleQuantityChange={handleFiveQuantityChange}
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
              onPress={clearAllInputs}
              style={{
                borderWidth: 1,
                borderColor: '#000',
                backgroundColor: '#D4A017',
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
                backgroundColor: 'green',
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
  addqtyhead: {
    backgroundColor: 'green',
    padding: 10
  },
  addqtytxt:
  {
    color: 'white',
    fontWeight: 'bold'
  },
  sizehead: {
    padding: 1,
    backgroundColor: '#E7E7E7',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10
  },
  sizetxt:
  {
    flex: 0.6,
    color: '#000',
    fontWeight: 'bold',
    marginLeft: 5
  },
  quantitytxt: {
    color: '#000',
    fontWeight: 'bold',
    flex: 0.4
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
    flexDirection: 'row',
    alignItems: 'center',
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
