import {
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    FlatList,
  } from 'react-native';
  import React, {useRef, useState} from 'react';
 
  const CustomDropDown = () => {
    const [clicked, setClicked] = useState(false);
  
    return (
      <View style={{}}>
        <TouchableOpacity
          style={{
            width: '90%',
            height: 50,
            borderRadius: 10,
            borderWidth: 0.5,
            alignSelf: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingLeft: 15,
            paddingRight: 15,
          }}
          onPress={() => {
            setClicked(!clicked);
          }}>
          <Text style={{fontWeight:'600'}}>
            Customer
          </Text>
          {clicked ? (
            <Image
              source={require('../../assets/upload.png')}
              style={{width: 20, height: 20}}
            />
          ) : (
            <Image
              source={require('../../assets/dropdown.png')}
              style={{width: 20, height: 20}}
            />
          )}
        </TouchableOpacity>
        {clicked ? (
          <View
            style={{
              elevation: 5,
              height: 300,
              alignSelf: 'center',
              width: '90%',
              backgroundColor: '#fff',
              borderRadius: 10,
            }}>
           
          </View>
        ) : null}
      </View>
    );
  };
  
  export default CustomDropDown;