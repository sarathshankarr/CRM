import React, { useState } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SliderBox } from 'react-native-image-slider-box';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../../redux/actions/Actions';
import ModalComponent from '../../components/ModelComponent';

const Details = ({ route }) => {
  const {
    item,
    name,
    image,
    image2,
    image3,
    image4,
    image5,
    category,
    disription,
    tags,
    set,
  } = route.params;

  const images = [image, image2, image3, image4, image5];
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const openModal = item => {
    if (item && item.styleId) {
      setSelectedItem(item);
      setModalVisible(true);
    } else {
      console.error('Invalid item format:', item);
    }
  };
  
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const addItem = item => {
    dispatch(addItemToCart(item));
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <SliderBox
          images={item && item.imageUrls ? item.imageUrls : []}
          sliderBoxHeight={Dimensions.get('window').height * 0.5}
          resizeMethod={'resize'}
          resizeMode={'contain'}
        />
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>Price: {item.mrp}</Text>
          <TouchableOpacity>
            <Image
              style={styles.priceImage}
              source={require('../../../assets/heart.png')}
            />
          </TouchableOpacity>
        </View>
        {/* <View style={styles.categoryContainer}>
          <Text style={styles.detailLabel}>Category:</Text>
          <Text style={styles.detailValue}>{category}</Text>
        </View> */}
        <View style={styles.tagsContainer}>
          <Text style={styles.detailLabel}>Style Name</Text>
          <Text style={styles.detailValue}>{item.styleName}</Text>
        </View>
        <View style={styles.setContainer}>
          <Text style={styles.detailLabel}>Color Name:</Text>
          <Text style={styles.detailValue}>{item.colorName}</Text>
        </View>
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Discription:</Text>
          <Text style={styles.txt}>{item.styleDesc}</Text>
        </View>
      </ScrollView>
      <TouchableOpacity onPress={() => openModal(item)} style={styles.buttonContainer}>
  <Text style={styles.buttonText}>ADD QUANTITY</Text>
</TouchableOpacity>

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
  scrollView: {
    flexGrow: 1,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 20,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginVertical: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tagsContainer: {
    marginHorizontal: 20,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginVertical: 10,
  },
  setContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginVertical: 10,
    alignItems: "center"
  },
  notesContainer: {
    flexDirection: 'row',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    alignItems: "center",
    marginHorizontal: 20
  },
  priceText: {
    marginVertical: 10,
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
  },
  priceImage: {
    width: 40,
    height: 40,
  },
  detailLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    marginRight: 10,
  },
  detailValue: {
    fontSize: 18,
  },
  notesLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  txt: {
    fontSize: 20,
    color: '#000',
    marginHorizontal: 5
  },
  buttonContainer: {
    borderWidth: 1,
    backgroundColor: 'gray',
    width: '100%',
    paddingVertical: 13,
    position: 'absolute',
    bottom: 0,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Details;
