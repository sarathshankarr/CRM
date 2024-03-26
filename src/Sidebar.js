import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const Sidebar = ({ userName, companyName }) => {
    const navigation=useNavigation();
    const goToStore = () => {
        console.log('Navigating to Store');
        navigation.navigate('Home');
      };
  return (
    <View style={style.container}>
        <View style={{backgroundColor:"#56994B"}}>
        <View style={style.header}>
        <TouchableOpacity>
          <Image style={[style.img,{ tintColor: '#fff' }]} source={require('../assets/profile.png')} />
        </TouchableOpacity>
        <TouchableOpacity style={style.editbox}>
        <Image
            style={[style.editimg, { tintColor: '#fff' }]} 
            source={require('../assets/edit.png')}
          />          <Text style={style.edittxt}>EDIT PROFILE</Text>
        </TouchableOpacity>
      </View>
      <Text style={style.usertxt}>name:{userName}</Text>
      <Text style={style.companynametxt}>companyName:{companyName}</Text>
        </View>
      <TouchableOpacity  onPress={goToStore} style={{flexDirection:"row",alignItems:"center",marginHorizontal:10,marginVertical:10}}>
        <Image style={{height:40,width:40}} source={require('../assets/store.png')}/>
        <Text style={{fontSize:16,marginLeft:10}}>
            Home
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const style = StyleSheet.create({
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
    alignItems:"center",
    marginTop:3,
    marginRight:8
  },
  editbox: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 9,
    flexDirection:"row",
    marginLeft:30
  },
  edittxt:{
    color:"#fff",
    fontWeight:"bold"
  },
  usertxt:{
    marginLeft:20,
    fontSize:20,
    marginHorizontal:10,
    color:"#fff",
  },
  companynametxt:{
    marginLeft:20,
    fontSize:20,
    color:"#fff",
    marginBottom:10
  }

});
export default Sidebar;
