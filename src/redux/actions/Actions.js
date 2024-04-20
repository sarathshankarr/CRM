import {ADD_SELECTED_IMAGE, ADD_TO_CART, ADD_TO_PENDING, DELETE_NOTE, REMOVE_FROM_CART, REMOVE_SELECTED_IMAGE, SET_NOTE_DETAILS, UPDATE_CART_ITEM,SET_NOTE_TITLE,SET_NOTE_DESCRIPTION, SET_NOTE_SAVED} from '../ActionTypes';

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
export const setNoteDetails = ({ title, description }) => {
  return {
    type: SET_NOTE_DETAILS,
    payload: { title, description }
  };
};
export const deleteNoteAction = () => {
  console.log("Delete note action dispatched!");
  return {
    type: DELETE_NOTE,
  };
};
export const setNoteTitle = (title) => ({
  type: SET_NOTE_TITLE,
  payload: title,
});

export const setNoteDescription = (description) => ({
  type: SET_NOTE_DESCRIPTION,
  payload: description,
});
export const setNoteSaved = (isSaved) => ({
  type: SET_NOTE_SAVED,
  payload: isSaved,
});
