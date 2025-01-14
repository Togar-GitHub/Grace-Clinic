import { csrfFetch } from './csrf';

// ACTION CREATORS
const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";

const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user
  };
};

const removeUser = () => {
  return {
    type: REMOVE_USER
  };
};

// THUNK 
export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  console.log('in thunk > ', credential, password);
  const response = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({
      credential,
      password
    })
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

export const managerUser = (user) => async (dispatch) => {
  const { credential, password } = user;
  
  try {
    const response = await csrfFetch("/api/session", {
      method: "POST",
      body: JSON.stringify({
        credential,
        password
      })
    });

    if (response.ok) {
      const data = await response.json();
      return data;  // Return the response data if it's OK
    } else {
      // Return response status code if not OK
      return { status: response.status, message: response.statusText };
    }
  } catch (error) {
    // Handle errors that happen during the fetch
    console.error("An error occurred:", error);
    return { status: 500, message: "Internal Server Error" };  // Generic error for network issues
  }
};


export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch('/api/session');
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

export const signup = (user) => async (dispatch) => {
  const { 
    firstName,
    lastName,
    dateOfBirth,
    gender,
    username,
    email, 
    password, 
    address,
    city,
    state,
    zip,
    phone,
    allergy,
    staff,
    position
   } = user;

  const response = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      firstName,
      lastName,
      dateOfBirth,
      gender,
      username,
      email, 
      password, 
      address,
      city,
      state,
      zip,
      phone,
      allergy,
      staff,
      position
    })
  });

  const data = await response.json();
  console.log('data > ', data);
  dispatch(setUser(data.user));
  return response;
};

export const logout = () => async (dispatch) => {
  const response = await csrfFetch('/api/session', {
    method: 'DELETE'
  });
  dispatch(removeUser());
  return response;
};

// REDUCERS
const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };

    case REMOVE_USER:
      return { ...state, user: null };

    default:
      return state;
  }
};

export default sessionReducer;