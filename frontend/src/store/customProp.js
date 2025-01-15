export const setCustomProp = (customProp) => {
  return {
    type: 'SET_CUSTOM_PROP',
    payload: customProp
  };
};

// Action to clear the customProp
export const clearCustomProp = () => ({
  type: 'CLEAR_CUSTOM_PROP',
});

// store/reducers/customPropReducer.js
const initialState = {
  customProp: null,
};

const customPropReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_CUSTOM_PROP':
      return {
        ...state,
        customProp: action.payload
      };
    case 'CLEAR_CUSTOM_PROP': // Action to clear the customProp
    return {
      ...state,
      customProp: null,
    };
  default:
      return state;
  }
};

export default customPropReducer;