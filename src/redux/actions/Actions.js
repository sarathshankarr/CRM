import {ADD_SELECTED_IMAGE, ADD_TO_CART, ADD_TO_PENDING, REMOVE_FROM_CART, REMOVE_SELECTED_IMAGE, UPDATE_CART_ITEM,} from '../ActionTypes';

export const addItemToCart = data => ({
  type: ADD_TO_CART,
  payload: data,
});

export const removeFromCart = index => {
  return {
    type: REMOVE_FROM_CART,
    payload: index
  };
};
export const updateCartItem = (index, field, quantity) => ({
  type: UPDATE_CART_ITEM,
  payload: { index, field, quantity },
});

export const addSelectedImage = (imageUri) => ({
  type: ADD_SELECTED_IMAGE,
  payload: imageUri,
});

export const removeSelectedImage = (imageUri) => ({
  type: REMOVE_SELECTED_IMAGE,
  payload: imageUri,
});
export const addToPending = (cartItems) => {
  
  console.log('Adding to pending:', cartItems);
  return {
    type: ADD_TO_PENDING,
    payload: cartItems,
  };
};
