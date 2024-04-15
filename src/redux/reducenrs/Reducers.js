import { ADD_SELECTED_IMAGE, ADD_TO_CART, REMOVE_FROM_CART, REMOVE_SELECTED_IMAGE, UPDATE_CART_ITEM } from '../ActionTypes';

const initialState = {
  cartItems: [], 
   selectedImages: [],
  // Add other initial states as needed
};

const reducers = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      return {
        ...state,
        cartItems: [...state.cartItems, action.payload],
      };
    case REMOVE_FROM_CART:
      return {
        ...state,
        cartItems: state.cartItems.filter((item, index) => index !== action.payload),
      };
    case UPDATE_CART_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.map((item, index) => {
          if (index === action.payload.index) {
            // Update the quantity of the specified field
            return {
              ...item,
              [action.payload.field]: action.payload.quantity,
            };
          }
          return item;
        }),
      };
      case ADD_SELECTED_IMAGE:
      return {
        ...state,
        selectedImages: [...state.selectedImages, action.payload],
      };
    case REMOVE_SELECTED_IMAGE:
      return {
        ...state,
        selectedImages: state.selectedImages.filter(image => image !== action.payload),
      };
    default:
      return state;
      
      
  }

};

export default reducers;
