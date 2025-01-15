import { csrfFetch } from './csrf';

// ACTION TYPES
const GET_USER_BY_ID = 'user/GET_USER_BY_ID';
const GET_DOCTORS = 'user/GET_DOCTORS';
const SET_NO_USER_MSG = 'user/SET_NO_USER_MSG';
const CLEAR_NO_USER_MSG = 'user/CLEAR_NO_USER_MSG';

// ACTION CREATORS
const getUserById = (userId) => {
  return {
    type: GET_USER_BY_ID,
    userId
  }
}

const getDoctors = (doctors) => {
  return {
    type: GET_DOCTORS,
    doctors
  }
}

const setNoUserMsg = (message) => {
  return {
    type: SET_NO_USER_MSG,
    message
  }
}

const clearNoUserMsg = () => {
  return {
    type: CLEAR_NO_USER_MSG
  }
}

// THUNK
export const getUserByIdThunk = (userId) => async (dispatch) => {
  const res = await csrfFetch(`/api/users/${userId}`);

  if (res.ok) {
    const userById = await res.json();
    dispatch(getUserById(userById));
    dispatch(clearNoUserMsg());
    return userById;
  } else {
    dispatch(setNoUserMsg('User is not found or failed to get a User'))
  }
}

export const getDoctorsThunk = () => async (dispatch) => {
  const res = await csrfFetch('/api/users/doctors');

  if (res.ok) {
    const doctors = await res.json();
    console.log('doctors > ', doctors);
    dispatch(getDoctors(doctors));
    dispatch(clearNoUserMsg());
    return doctors;
  } else {
    dispatch(setNoUserMsg('Doctors not found or failed to get Doctors'))
  }
}

// INITIAL STATE
const initialState = {
  user: [],
  allUsers: [],
  doctors: [],
  noUserMsg: null,
  error: null
}

// REDUCER
const userReducer = (state = initialState, action) => {
  switch(action.type) {
    case GET_USER_BY_ID:
      return { ...state, user: action.userById }

    case GET_DOCTORS:
      return { ...state, doctors: action.doctors }

    case SET_NO_USER_MSG:
      return { ...state, noUserMsg: action.message }

    case CLEAR_NO_USER_MSG:
      return { ...state, noUserMsg: null }

    default:
      return state
  }
}

export default userReducer;