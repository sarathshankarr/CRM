import React, { useEffect, useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';

const Sidebar = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState(require('../assets/profile.png'));
  const [userData, setUserData] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownVisiblee, setDropdownVisiblee] = useState(false); // Add state for second dropdown if needed

  useEffect(() => {
    const { params } = route ?? {};
    if (params && params.userData) {
      setUserData(params.userData);
    } else {
      // If userData is not passed as prop, retrieve from AsyncStorage
      getUserDataFromStorage();
    }
  }, [route]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getUserDataFromStorage();
    });
    return unsubscribe;
  }, [navigation]);

  const getUserDataFromStorage = async () => {
    const userToken = await AsyncStorage.getItem('userdata');
    if (userToken) {
      setUserData(JSON.parse(userToken));
    }
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const toggleDropdownSecond = () => {
    setDropdownVisiblee(!dropdownVisiblee);
  };

  const goToHome = () => {
    navigation.navigate('Home');
  };

  const goToCategories = () => {
    navigation.navigate('Categories');
  };

  const goToOrder = () => {
    navigation.navigate('Order');
  };

  const goToProductInventory = () => {
    navigation.navigate('ProductInventory');
  };

  const goToLocationInventory = () => {
    navigation.navigate('LocationInventory');
  };

  const goToDistributorGrn = () => {
    navigation.navigate('Distributor GRN');
  };

  const goToEditProfile = () => {
    navigation.navigate('Profile');
  };
  const goToActivities= () => {
    navigation.navigate('Activities');
  };
  


  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      compressImageQuality: 0.7,
    })
      .then(image => {
        setImage({ uri: image.path });
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
      compressImageQuality: 0.7,
    })
      .then(image => {
        setImage({ uri: image.path });
        setModalVisible(false);
      })
      .catch(error => {
        console.log('Error choosing photo from library:', error);
        setModalVisible(false);
      });
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userdata'); // Remove the user data from AsyncStorage
      await AsyncStorage.removeItem('userRole'); // Remove the user role from AsyncStorage
      await AsyncStorage.removeItem('userRoleId'); // Remove the user role ID from AsyncStorage
      await AsyncStorage.removeItem('loggedInUser'); // Remove the logged-in user data from AsyncStorage
      await AsyncStorage.removeItem('selectedCompany'); // Remove the logged-in user data from AsyncStorage
      navigation.closeDrawer(); // Close the drawer
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }], 
    });
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{backgroundColor: '#390050'}}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image
              style={[styles.img, {borderRadius: 30, tintColor: '#fff'}]}
              source={image}
            />
          </TouchableOpacity>
          <Text style={{color: '#fff', fontSize: 20}}>Profile</Text>
        </View>
        <View>
          {userData && (
            <Text style={styles.usertxt}>
              Name : {userData.token.firstName} {userData.token.lastName}
            </Text>
          )}
        </View>
      </View>

      <TouchableOpacity onPress={goToHome} style={styles.homeheader}>
        <Image style={styles.homeimg} source={require('../assets/store.png')} />
        <Text style={styles.hometxt}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={goToCategories} style={styles.categorieshead}>
        <Image
          style={styles.categoriesimg}
          source={require('../assets/menu-1.png')}
        />
        <Text style={styles.categoriestxt}>Categories</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={goToOrder} style={styles.orderhead}>
        <Image
          style={styles.orderimg}
          source={require('../assets/order-1.png')}
        />
        <Text style={styles.ordertxt}>Order</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.inventoryhead} onPress={toggleDropdown}>
        <Image
          style={styles.orderimg}
          source={require('../assets/inventory.png')}
        />
        <Text style={styles.ordertxt}>Inventory</Text>
        <View style={{marginLeft: 'auto'}}>
          <Image
            source={require('../assets/dropdown.png')}
            style={{width: 20, height: 20}}
          />
        </View>
      </TouchableOpacity>
     

      {dropdownVisible && (
        <View style={styles.dropdown}>
          <TouchableOpacity
            onPress={() => goToProductInventory('Product Inventory')}>
            <Text style={styles.dropdownItem}>Product Inventory</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => goToLocationInventory('Location Wise Inventory')}>
            <Text style={styles.dropdownItemm}>Location Wise Inventory</Text>
          </TouchableOpacity>
          {/* Add more dropdown items here */}
        </View>
      )}
       <TouchableOpacity onPress={goToDistributorGrn} style={styles.distributorhead}>
        <Image
          style={styles.distributorimg}
          source={require('../assets/distributor.png')}
        />
        <Text style={styles.ordertxt}>Distributor GRN</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.inventoryhead} onPress={toggleDropdownSecond}>
        <Image
          style={styles.orderimg}
          source={require('../assets/activity.png')}
        />
        <Text style={styles.ordertxt}>Campaign Management</Text>
        <View style={{ marginLeft: 'auto' }}>
          <Image
            source={require('../assets/dropdown.png')}
            style={{ width: 20, height: 20 }}
          />
        </View>
      </TouchableOpacity>
      {dropdownVisiblee && (
        <View style={styles.dropdown}>
          <TouchableOpacity onPress={goToActivities}>
            <Text style={styles.dropdownItem}>Activities</Text>
          </TouchableOpacity>
          {/* Add more dropdown items here */}
        </View>
      )}
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

      <View style={styles.logoutContainer}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutbox}>
          <Image
            resizeMode="contain"
            style={[
              styles.logoutimg,
              {tintColor: '#fff', height: 20, width: 20},
            ]}
            source={require('../assets/logout.png')}
          />
          <Text style={styles.logouttxt}>Logout</Text>
        </TouchableOpacity>
      </View>
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
  usertxt: {
    marginLeft: 20,
    fontSize: 20,
    marginHorizontal: 10,
    marginVertical: 10,
    color: '#fff',
  },
  homeheader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 25,
  },
  homeimg: {
    height: 30,
    width: 30,
  },
  hometxt: {
    fontSize: 16,
    marginLeft: 10,
  },
  categorieshead: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  categoriesimg: {
    height: 25,
    width: 25,
  },
  categoriestxt: {
    fontSize: 16,
    marginLeft: 10,
  },
  orderhead: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 20,
  },
  inventoryhead: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 20,
  },
  distributorhead: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 20,
  },
  orderimg: {
    height: 30,
    width: 30,
  },
  distributorimg: {
    height: 35,
    width: 35,
  },
  ordertxt: {
    fontSize: 16,
    marginLeft: 10,
  },
  dropdownItem: {
    fontSize: 16,
    marginHorizontal: 30,
    marginTop: 15,
  },
  dropdownItemm: {
    fontSize: 16,
    marginHorizontal: 30,
    marginTop: 15,
  },
  logoutContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  logoutbox: {
    borderWidth: 1,
    borderColor: '#390050',
    backgroundColor: '#390050',
    borderRadius: 15,
    paddingVertical: 12,
    flexDirection: 'row',
    marginHorizontal: 30,
    justifyContent: 'center',
    marginBottom: 10,
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
