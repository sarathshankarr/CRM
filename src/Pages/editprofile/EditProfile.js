import React, {useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const Profile = () => {
  const [selectedTab, setSelectedTab] = useState('ORGANIZATION');
  const [organizationName, setOrganizationName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [selectState, setSelectState] = useState('');
  const [selectCity, setSelectCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [udyamType, setUdyamType] = useState('');
  const [udyamNumber, setUdyamNumber] = useState('');
  const [enterName, setEnterName] = useState('');
  const [alternateNumber, setAlternateNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');

  const [selectedApparels, setSelectedApparels] = useState([]);

  // Array of apparel options
  const apparelOptions = [
    'Dress',
    'Kurti',
    'Garment',
    'Fabric',
    'Saree',
    'Other',
  ];

  const handleOrganizationNameChange = text => {
    setOrganizationName(text);
  };

  const handleContactNumberChange = text => {
    setContactNumber(text);
  };
  const handleAddressChange = text => {
    setAddress(text);
  };
  const handleSelectState = text => {
    setSelectState(text);
  };
  const handleSelectCity = text => {
    setSelectCity(text);
  };
  const handlePincodeChange = text => {
    setPincode(text);
  };
  const handlePanNumberChange = text => {
    setPanNumber(text);
  };
  const handleGstNumberChange = text => {
    setGstNumber(text);
  };
  const handleUdyamTypeChange = text => {
    setUdyamType(text);
  };
  const handleUdyamNumberChange = text => {
    setUdyamNumber(text);
  };
  const handleEnterYourName = text => {
    setEnterName(text);
  };

  const handleAlternateNumberChange = text => {
    setAlternateNumber(text);
  };

  const handleEmailAddressChange = text => {
    setEmailAddress(text);
  };
  const handleApparelSelection = apparel => {
    // Toggle selection of apparel
    if (selectedApparels.includes(apparel)) {
      setSelectedApparels(selectedApparels.filter(item => item !== apparel));
    } else {
      setSelectedApparels([...selectedApparels, apparel]);
    }
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSelectedTab('ORGANIZATION')}>
            <View
              style={[
                styles.tab,
                selectedTab === 'ORGANIZATION' && styles.selectedTab,
              ]}>
              <Text style={styles.orgtxt}>ORGANIZATION INFO</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedTab('PERSONAL')}>
            <View
              style={[
                styles.tab,
                selectedTab === 'PERSONAL' && styles.selectedTab,
              ]}>
              <Text style={styles.pertxt}>PERSONAL INFO</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.lineContainer}>
          <View
            style={[
              styles.line,
              selectedTab === 'ORGANIZATION' && styles.selectedLine,
            ]}
          />
          <View
            style={[
              styles.line,
              selectedTab === 'PERSONAL' && styles.selectedLine,
            ]}
          />
        </View>
        {selectedTab === 'ORGANIZATION' && (
          <View>
            <TouchableOpacity style={styles.orgInfoContainer}>
              <View style={styles.logoContainer}>
                <View style={styles.roundLogo}>
                  <Image
                    style={styles.addLogoIcon}
                    source={require('../../../assets/addlogo.png')}
                  />
                </View>
                <Text style={styles.addLogoText}>ADD LOGO</Text>
              </View>
              <Image
                style={styles.cameraIcon}
                source={require('../../../assets/cam.png')}
              />
            </TouchableOpacity>
            <View>
              <View style={styles.orgnmetxt}>
                <TextInput
                  placeholder="Organization Name"
                  value={organizationName}
                  onChangeText={handleOrganizationNameChange}
                />
                <View style={styles.underlne} />
              </View>
            </View>
            <View>
              <View style={styles.contxt}>
                <TextInput
                  placeholder="Contact Number"
                  value={contactNumber}
                  onChangeText={handleContactNumberChange}
                  keyboardType="numeric"
                />
                <View style={styles.underlne} />
              </View>
            </View>
            <View style={{marginTop: 10, marginLeft: 15}}>
              <Text style={{fontSize: 20, color: '#000', fontWeight: 'bold'}}>
                Apparel Type
              </Text>
            </View>
            <View style={styles.apparelContainer}>
              {apparelOptions.map((apparel, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.apparelButton,
                    selectedApparels.includes(apparel) &&
                      styles.selectedApparel,
                  ]}
                  onPress={() => handleApparelSelection(apparel)}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: '#000',
                      fontWeight: 'bold',
                    }}>
                    {apparel}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View>
              <View style={styles.contxt}>
                <TextInput
                  placeholder="Address"
                  value={address}
                  onChangeText={handleAddressChange}
                />
                <View style={styles.underlne} />
              </View>
            </View>
            <TouchableOpacity>
              <View style={styles.contxt}>
                <TextInput
                  placeholder="Select State"
                  value={selectState}
                  onChangeText={handleSelectState}
                />
                <View style={styles.underlne} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={styles.contxt}>
                <TextInput
                  placeholder="Select City"
                  value={selectCity}
                  onChangeText={handleSelectCity}
                />
                <View style={styles.underlne} />
              </View>
            </TouchableOpacity>
            <View>
              <View style={styles.contxt}>
                <TextInput
                  placeholder="Pincode"
                  value={pincode}
                  onChangeText={handlePincodeChange}
                  keyboardType="numeric"
                />
                <View style={styles.underlne} />
              </View>
            </View>
            <View>
              <View style={styles.contxt}>
                <TextInput
                  placeholder="PAN Number"
                  value={panNumber}
                  onChangeText={handlePanNumberChange}
                />
                <View style={styles.underlne} />
              </View>
            </View>
            <View>
              <View style={styles.contxt}>
                <TextInput
                  placeholder="GST Number"
                  value={gstNumber}
                  onChangeText={handleGstNumberChange}
                />
                <View style={styles.underlne} />
              </View>
            </View>
            <View>
              <View style={{marginBottom: 50, marginLeft: 20, marginTop: 10}}>
                <TextInput
                  placeholder="Udyam Type"
                  value={udyamType}
                  onChangeText={handleUdyamTypeChange}
                />
                <View style={styles.underlne} />
              </View>
            </View>
            <View>
              <View style={styles.contxt}>
                <TextInput
                  placeholder="Udyam Number"
                  value={udyamNumber}
                  onChangeText={handleUdyamNumberChange}
                />
                <View style={styles.underlne} />
              </View>
            </View>
          </View>
        )}

        {selectedTab === 'PERSONAL' && (
          <View>
            <TouchableOpacity style={styles.personalInfoContainer}>
              <View style={styles.profileImageContainer}>
                <Image
                  style={[styles.profileImage, {tintColor: 'gray'}]}
                  source={require('../../../assets/profile.png')}
                />
                <Image
                  style={styles.cameraIconRight}
                  source={require('../../../assets/cam.png')}
                />
              </View>
            </TouchableOpacity>
            <View style={styles.contxt}>
              <TextInput
                placeholder="Enter Your Full Name"
                value={enterName}
                onChangeText={handleEnterYourName}
              />
              <View style={styles.underlne} />
            </View>
            <View>
              <View style={styles.contxt}>
                <TextInput
                  placeholder="Mobile Number"
                  value={contactNumber}
                  onChangeText={handleContactNumberChange}
                  keyboardType="numeric"
                />
                <View style={styles.underlne} />
              </View>
            </View>
            <View>
              <View style={styles.contxt}>
                <TextInput
                  placeholder="Alternate Number"
                  value={alternateNumber}
                  onChangeText={handleAlternateNumberChange}
                  keyboardType="numeric"
                />
                <View style={styles.underlne} />
              </View>
            </View>
            <View>
              <View style={styles.contxt}>
                <TextInput
                  placeholder="Email Address"
                  value={emailAddress}
                  onChangeText={handleEmailAddressChange}
                  keyboardType="email-address"
                />
                <View style={styles.underlne} />
              </View>
            </View>
            <View>
              <View style={styles.contxt}>
                <TextInput
                  placeholder="PAN Number"
                  value={panNumber}
                  onChangeText={handlePanNumberChange}
                />
                <View style={styles.underlne} />
              </View>
            </View>
          </View>
        )}
      </ScrollView>
      <TouchableOpacity
        style={{
          borderWidth: 1,
          backgroundColor: 'gray',
          position: 'absolute',
          bottom: 0,
          width: '100%',
          paddingVertical: 20,
        }}>
        <Text
          style={{
            textAlign: 'center',
            color: '#fff',
            fontSize: 20,
            fontWeight: 'bold',
          }}>
          Update
        </Text>
      </TouchableOpacity>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  orgtxt: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pertxt: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 20,
  },
  lineContainer: {
    flexDirection: 'row',
  },
  line: {
    height: 4,
    backgroundColor: 'transparent',
    width: '50%',
  },
  selectedLine: {
    backgroundColor: '#000',
  },
  orgInfoContainer: {
    borderWidth: 1,
    borderColor: '#000',
    marginHorizontal: 140,
    marginVertical: 40,
    paddingVertical: 35,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  addLogoIcon: {
    height: 20,
    width: 20,
  },
  addLogoText: {
    textAlign: 'center',
    marginLeft: 5,
    color: 'gray',
    fontWeight: 'bold',
  },
  cameraIcon: {
    height: 35,
    width: 35,
    position: 'absolute',
    top: 1,
    right: 1,
  },
  personalInfoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    height: 110,
    width: 110,
  },
  cameraIconRight: {
    height: 35,
    width: 35,
    position: 'absolute',
    top: 1,
    right: 1,
  },
  orgnmetxt: {
    marginLeft: 20,
  },
  contxt: {
    marginLeft: 20,
    marginTop: 10,
  },
  underlne: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginRight: 10,
  },
  apparelContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 5,
    marginVertical: 10,
  },
  apparelButton: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 60,
    paddingVertical: 6,
    width: 120, // Set a fixed width for each button
    marginVertical: 5,
  },

  selectedApparel: {
    backgroundColor: 'green', // Change to green when selected
  },
});

export default Profile;
