import {
  ADD_SELECTED_IMAGE,
  ADD_TO_CART,
  ADD_TO_PENDING,
  CLEAR_CART,
  DELETE_NOTE,
  REMOVE_FROM_CART,
  REMOVE_SELECTED_IMAGE,
  SET_LOGGED_IN_USER,
  SET_NOTE_DETAILS,
  SET_NOTE_SAVED,
  SET_SELECTED_COMPANY,
  SET_USER_ROLE,
  STORE_CATEGORY_IDS,
  UPDATE_CART_ITEM,
} from '../ActionTypes';

const initialState = {
  cartItems: [],
  selectedImages: [],
  pendingItems: [],
  noteDetails: {
    title: '',
    description: '',
  },
  notes: [],
  noteSaved: false,
  userRole: null,
  loggedInUser: null,
  selectedCompany: null,
  categoryIds: [],
};

const reducers = (state = initialState, action) => {
    switch (action.type) {
      case ADD_TO_CART:
        return {
          ...state,
          cartItems: [...state.cartItems, action.payload],
        };
  
        case REMOVE_FROM_CART:
          const { styleId, colorId } = state.cartItems[action.payload];
          const updatedCartItems = state.cartItems.filter(
            item => !(item.styleId === styleId && item.colorId === colorId)
          );
          return {
            ...state,
            cartItems: updatedCartItems,
          };
        

    case UPDATE_CART_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.map((item, index) =>
          index === action.payload.index ? action.payload.updatedItem : item
        ),
      };

    case ADD_SELECTED_IMAGE:
      return {
        ...state,
        selectedImages: [...state.selectedImages, action.payload],
      };

    case REMOVE_SELECTED_IMAGE:
      return {
        ...state,
        selectedImages: state.selectedImages.filter(
          image => image !== action.payload,
        ),
      };

    case ADD_TO_PENDING:
      return {
        ...state,
        pendingItems: [...state.pendingItems, action.payload],
      };

    case SET_NOTE_DETAILS:
      return {
        ...state,
        noteDetails: {
          ...state.noteDetails,
          ...action.payload,
        },
      };

    case DELETE_NOTE:
      return {
        ...state,
        noteDetails: {
          title: '',
          description: '',
        },
      };

    case SET_NOTE_SAVED:
      return {
        ...state,
        noteSaved: action.payload,
      };

    case CLEAR_CART:
      return {
        ...state,
        cartItems: [],
      };

    case SET_USER_ROLE:
      return {
        ...state,
        userRole: action.payload,
      };

    case SET_LOGGED_IN_USER:
      return {
        ...state,
        loggedInUser: action.payload,
      };

    case SET_SELECTED_COMPANY:
      return {
        ...state,
        selectedCompany: action.payload,
      };

    case STORE_CATEGORY_IDS:
      return {
        ...state,
        categoryIds: action.payload,
      };

    default:
      return state;
  }
};

export default reducers;
