import React from "react";
import { Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RemoveItemFromCart } from "../../redux/action/Action";

const Cart =()=>{
    
    const dispatch=useDispatch()
    const removeItem=(index)=>{
        dispatch(RemoveItemFromCart(index))
    }
    const items=useSelector(state=>state)
    return(
        <View>
            <Text>
                Cart
            </Text>
        </View>
    )
}
export default Cart;