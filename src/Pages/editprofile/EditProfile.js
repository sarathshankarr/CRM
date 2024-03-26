import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const Profile = () => {
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity>
                <Text>
                    ORGANIZATION INFO
                </Text>
                </TouchableOpacity>
                <TouchableOpacity>
                <Text>
                    PERSONAL INFO
                </Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.logornd}>
                <View style={styles.logoContainer}>
                    <View style={styles.roundLogo}>
                        <Image style={styles.addLogoIcon} source={require('../../../assets/addlogo.png')} />
                    </View>
                    <Text style={styles.addLogoText}>ADD LOGO</Text>
                </View>
                <Image style={styles.cameraIcon} source={require('../../../assets/cam.png')} />
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        marginTop: 20,
    },
    logornd: {
        borderWidth: 1,
        borderColor: "#000",
        marginHorizontal: 140,
        marginVertical: 40,
        paddingVertical: 35,
        borderRadius: 100, 
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        
    },
    logoContainer: {
        alignItems: "center"
    },
    addLogoIcon: {
        height: 20,
        width: 20
    },
    addLogoText: {
        textAlign: "center",
        marginLeft: 5,
        color:"#000"
    },
    cameraIcon: {
        height: 35,
        width: 35,
        position: "absolute", 
        top: 1, 
        right: 1 
    }
});

export default Profile;
