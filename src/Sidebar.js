import React, {useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
const Sidebar = ({userName, companyName}) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState(require('../assets/profile.png'));

  const goToHome = () => {
    console.log('Navigating to Home');
    navigation.navigate('Home');
  };

  const goToCategories = () => {
    console.log('Navigating to Categories');
    navigation.navigate('Categories');
  };

  const goToOrder = () => {
    console.log('Navigating to Order');
    navigation.navigate('Order');
  };
  const goToEditProfile =()=>{
    navigation.navigate("Profile")
  }
  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      compressImageQuality:0.7
    })
      .then(image => {
        console.log(image);
        setImage({uri: image.path});
        setModalVisible(false);
      })
      .catch(error => {
        console.log('Error taking photo from camera:', error);
        setModalVisible(false);
      });
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      compressImageQuality:0.7
    })
      .then(image => {
        console.log(image);
        setImage({uri: image.path});
        setModalVisible(false);
      })
      .catch(error => {
        console.log('Error choosing photo from library:', error);
        setModalVisible(false);
      });
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userdata');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{backgroundColor: '#56994B'}}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image style={[styles.img, {borderRadius: 30}]} source={image} />
          </TouchableOpacity>

          <TouchableOpacity onPress={goToEditProfile} style={styles.editbox}>
            <Image
              style={[styles.editimg, {tintColor: '#fff'}]}
              source={require('../assets/edit.png')}
            />
            <Text style={styles.edittxt}>EDIT PROFILE</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.usertxt}>name:{userName}</Text>
        <Text style={styles.companynametxt}>companyName:{companyName}</Text>
      </View>
      <TouchableOpacity
        onPress={goToHome}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 10,
          marginVertical: 25,
        }}>
        <Image
          style={{height: 40, width: 40}}
          source={require('../assets/store.png')}
        />
        <Text style={{fontSize: 16, marginLeft: 10}}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={goToCategories}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 10,
        }}>
        <Image
          style={{height: 40, width: 40}}
          source={require('../assets/cate.png')}
        />
        <Text style={{fontSize: 16, marginLeft: 10}}>Categories</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={goToOrder}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 10,
          marginVertical: 25,
        }}>
        <Image
          style={{height: 40, width: 40}}
          source={require('../assets/order.png')}
        />
        <Text style={{fontSize: 16, marginLeft: 10}}>Order</Text>
      </TouchableOpacity>
      <View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutbox}>
          <Image
            style={[styles.logoutimg, {tintColor: '#fff'}]}
            source={require('../assets/logout.png')}
          />
          <Text style={styles.logouttxt}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Image Modal */}
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
              <Text style={{color: 'white'}}>Cancel</Text>
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
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  img: {
    height: 60,
    width: 60,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  editimg: {
    height: 15,
    width: 15,
    alignItems: 'center',
    marginTop: 3,
    marginRight: 8,
  },
  editbox: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 9,
    flexDirection: 'row',
    marginLeft: 30,
  },
  edittxt: {
    color: '#fff',
    fontWeight: 'bold',
  },
  usertxt: {
    marginLeft: 20,
    fontSize: 20,
    marginHorizontal: 10,
    color: '#fff',
  },
  companynametxt: {
    marginLeft: 20,
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
  },
  logoutbox: {
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: 'gray',
    borderRadius: 15,
    paddingVertical: 12,
    flexDirection: 'row',
    marginHorizontal: 30,
    justifyContent: 'center',
    marginTop: 350,
  },
  logoutimg: {
    height: 20,
    width: 15,
    marginRight: 8,
  },
  logouttxt: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
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

export default Sidebar;
