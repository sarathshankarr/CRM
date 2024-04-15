import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, Modal, ScrollView } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { useDispatch, useSelector } from 'react-redux';
import { addSelectedImage, removeSelectedImage } from '../../redux/actions/Actions';

const AddNote = () => {
  const dispatch = useDispatch();
  const selectedImages = useSelector(state => state.selectedImages);
  const [modalVisible, setModalVisible] = useState(false);

  const addImageToSelection = (imageUri) => {
    console.log("Adding image to selection:", imageUri);
    dispatch(addSelectedImage(imageUri));
  };
  
  const removeImageFromSelection = (imageUri) => {
    console.log("Removing image from selection:", imageUri);
    dispatch(removeSelectedImage(imageUri));
  };
  
  console.log("Selected Images:", selectedImages);

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      compressImageQuality: 0.7,
    })
      .then((image) => {
        console.log(image);
        addImageToSelection(image.path);
        setModalVisible(false);
      })
      .catch((error) => {
        console.log('Error taking photo from camera:', error);
        setModalVisible(false);
      });
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      compressImageQuality: 0.7,
    })
      .then((image) => {
        console.log(image);
        addImageToSelection(image.path);
        setModalVisible(false);
      })
      .catch((error) => {
        console.log('Error choosing photo from library:', error);
        setModalVisible(false);
      });
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20 }}>
        <TouchableOpacity
          style={styles.button}
        >
          <Image
            style={styles.buttonImage}
            resizeMode='cover'
            source={require('../../../assets/savee.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)}
          style={styles.button}
        >
          <Image
            style={styles.buttonImage1}
            source={require('../../../assets/cam.png')}
          />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <Text style={styles.txt}>AddNote</Text>
        <Text style={styles.txt}>Photos Notes</Text>
      </View>
      <ScrollView>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 20 }}>
          {selectedImages.map((imageUri, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri: imageUri }} style={styles.image} />
              <TouchableOpacity onPress={() => removeImageFromSelection(imageUri)}>
                <Text>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={takePhotoFromCamera}>
              <Text>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={choosePhotoFromLibrary}>
              <Text>Choose from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setModalVisible(false)}>
              <Text style={{ color: 'white' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 50,
    padding: 15,
  },
  buttonImage: {
    height: 50,
    width: 50,
  },
  buttonImage1: {
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  txt: {
    marginTop: 10,
    fontSize: 20,
    marginLeft: 15,
    fontWeight: 'bold'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalButton: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalCancelButton: {
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: 'red',
    borderRadius: 10,
    marginTop: 10,
  },
  imageContainer: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#000',
    marginHorizontal: 20,
    paddingVertical: 20
  },
  image: {
    width: 100, // Adjust width as needed
    height: 100, // Adjust height as needed
    resizeMode: 'cover', // or 'contain' depending on your requirement
    marginLeft: 10
  },
});

export default AddNote;
