import {ADD_ITEM, REMOVE_ITEM} from '../ActionTypes';

export const addItemToCart = data => ({
  type: ADD_ITEM,
  payload: data,
});


export const RemoveItemFromCart = index => ({
    type: REMOVE_ITEM,
    payload: index,
  });