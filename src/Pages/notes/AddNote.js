import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, Modal } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

const AddNote = () => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const takePhotoFromCamera = () => {
        ImagePicker.openCamera({
          width: 300,
          height: 400,
          cropping: true,
          compressImageQuality: 0.7,
        })
          .then((image) => {
            console.log(image);
            setImage({ uri: image.path });
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
            setImage({ uri: image.path });
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
      <View style={{borderWidth:1,borderColor:'#000',paddingVertical:80,marginHorizontal:10,marginVertical:10}}> 

      </View>
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
    // borderRadius: 50, // Remove this line to ensure entire image is visible
  },
  buttonImage1: {
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  txt:{
    marginTop:10,
    fontSize:20,
    marginLeft:15,
    fontWeight:'bold'
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
});

export default AddNote;
