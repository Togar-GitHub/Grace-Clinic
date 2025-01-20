import { csrfFetch } from './csrf';

// ACTION TYPES
const GET_USER_BY_ID = 'user/GET_USER_BY_ID';
const GET_DOCTORS = 'user/GET_DOCTORS';
const GET_ALL_STAFF = 'user/GET_ALL_STAFF';
const GET_ALL_PATIENTS = 'user/GET_ALL_PATIENTS';
const UPDATE_USER = 'user/UPDATE_USER';
const DELETE_USER = 'user/DELETE_USER'
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

const getAllStaff = (allUsers) => {
  return {
    type: GET_ALL_STAFF,
    allUsers
  }
}

const getAllPatients = (allUsers) => {
  return {
    type: GET_ALL_PATIENTS,
    allUsers
  }
}

const updateUser = (user) => {
  return {
    type: UPDATE_USER,
    user
  }
}

const deleteUser = (user) => {
  return {
    type: DELETE_USER,
    user
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
    dispatch(getDoctors(doctors));
    dispatch(clearNoUserMsg());
    return doctors;
  } else {
    dispatch(setNoUserMsg('Doctors not found or failed to get Doctors'))
  }
}

export const getAllPatientsThunk = () => async (dispatch) => {
  const res = await csrfFetch('api/users/allPatients');

  if (res.ok) {
    const allPatients = await res.json();
    dispatch(getAllPatients(allPatients));
    dispatch(clearNoUserMsg());
    return allPatients;
  } else {
    dispatch(setNoUserMsg('All Patients not found or failed to get All Patients'))
  }
}

export const getAllStaffThunk = () => async (dispatch) => {
  const res = await csrfFetch('api/users/allStaff');

  if (res.ok) {
    const allStaff = await res.json();
    dispatch(getAllStaff(allStaff));
    dispatch(clearNoUserMsg());
    return allStaff;
  } else {
    dispatch(setNoUserMsg('All Staff not found or failed to get All Staff'))
  }
}

export const updateUserThunk = (userId, incomingUser) => async (dispatch) => {
  const res = await csrfFetch(`api/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(incomingUser)
  })

  if (res.ok) {
    const updatedUser = await res.json();
    dispatch(updateUser(updatedUser));
    dispatch(clearNoUserMsg());
    return updatedUser;
  } else {
    dispatch(setNoUserMsg('User not updated or failed to update the User'))
  }
}

export const deleteUserThunk = (userId) => async (dispatch) => {
  const res = await csrfFetch(`api/users/${userId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  })

  if (res.ok) {
    const deletedUser = await res.json();
    dispatch(deleteUser(deletedUser));
    dispatch(clearNoUserMsg());
    return deletedUser;
  } else {
    dispatch(setNoUserMsg('User not delete or failed to delete the User'))
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
      return { ...state, user: action.user }

    case GET_DOCTORS:
      return { ...state, doctors: action.doctors }

    case GET_ALL_STAFF:
      return { ...state, allUsers: action.allUsers }

    case GET_ALL_PATIENTS:
      return { ...state, allUsers: action.allUsers }

    case UPDATE_USER:
      return { ...state, user: action.user }

    case DELETE_USER:
      return { ...state, user: action.user }

    case SET_NO_USER_MSG:
      return { ...state, noUserMsg: action.message }

    case CLEAR_NO_USER_MSG:
      return { ...state, noUserMsg: null }

    default:
      return state
  }
}

export default userReducer;