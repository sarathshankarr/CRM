import {ADD_TO_CART, REMOVE_FROM_CART, UPDATE_CART_ITEM,} from '../ActionTypes';

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