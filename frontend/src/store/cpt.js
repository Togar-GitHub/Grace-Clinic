import { csrfFetch } from './csrf';

// ACTION TYPES
const GET_CPT_BY_ID = 'cpt/GET_CPT_BY_ID';
const UPDATE_CPT = 'cpt/UPDATE_CPT';
const DELETE_CPT = 'cpt/DELETE_CPT';
const CREATE_CPT = 'cpt/CREATE_CPT';
const GET_ALL_CPT = 'cpt/GET_ALL_CPT';
const SET_NO_CPT_MSG = 'cpt/SET_NO_CPT_MSG';
const CLEAR_NO_CPT_MSG = 'cpt/CLEAR_NO_CPT_MSG';

// ACTION CREATORS
const getCptById = (cptId) => {
  return {
    type: GET_CPT_BY_ID,
    cptId
  }
}

const updateCpt = (cptId, incomingCpt) => {
  return {
    type: UPDATE_CPT,
    cptId,
    incomingCpt
  }
}

const deleteCpt = (cptId) => {
  return {
    type: DELETE_CPT,
    cptId
  }
}

const createCpt = (incomingCpt) => {
  return {
    type: CREATE_CPT,
    incomingCpt
  }
}

const getAllCpt = (cpt) => {
  return {
    type: GET_ALL_CPT,
    cpt
  }
}

const setNoCptMsg = (message) => {
  return {
    type: SET_NO_CPT_MSG,
    message
  }
}

const clearNoCptMsg = () => {
  return {
    type: CLEAR_NO_CPT_MSG
  }
}

// THUNK
export const getCptByIdThunk = (cptId) => async (dispatch) => {
  const res = await csrfFetch(`/api/cpt/${cptId}`);

  if (res.ok) {
    const cptById = await res.json();
    dispatch(getCptById(cptById));
    dispatch(clearNoCptMsg());
    return cptById
  } else {
    dispatch(setNoCptMsg('No CPT Code found or failed to fetch a CPT Code'))
  }
}

export const updateCptThunk = (cptId, incomingCpt) => async (dispatch) => {
  const res = await csrfFetch(`/api/cpt/${cptId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(incomingCpt)
  })

  if (res.ok) {
    const updatedCpt = await res.json();
    dispatch(updateCpt(updatedCpt));
    dispatch(clearNoCptMsg());
    return updatedCpt;
  } else {
    dispatch(setNoCptMsg('CPT Code is not updated or failed to update CPT Code'))
  }
}

export const deleteCptThunk = (cptId) => async (dispatch) => {
  const res = await csrfFetch(`/api/cpt/${cptId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  })

  if (res.ok) {
    const deletedCpt = await res.json();
    dispatch(deleteCpt(deletedCpt));
    dispatch(clearNoCptMsg());
    return deletedCpt;
  } else {
    dispatch(setNoCptMsg('CPT Code is not deleted or failed to delete CPT Code'))
  }
}

export const createCptThunk = (incomingCpt) => async (dispatch) => {
  const res = await csrfFetch('/api/cpt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(incomingCpt)
  })

  if (res.ok) {
    const createdCpt = await res.json();
    dispatch(createCpt(createdCpt));
    dispatch(clearNoCptMsg());
    return createdCpt;
  } else {
    dispatch(setNoCptMsg('CPT Code is not created or failed to create CPT Code'))
  }
}

export const getAllCptThunk = () => async (dispatch) => {
  const res = await fetch('/api/cpt');

  if (res.ok) {
    const allCpt = await res.json();
    dispatch(getAllCpt(allCpt));
    dispatch(clearNoCptMsg());
    return allCpt;
  } else {
    dispatch(setNoCptMsg('No CPT Code found or failed to fetch CPT Code'))
  }
}

// INITIAL STATE
const initialState = {
  cpt: [],
  allCpt: [],
  noCptMsg: null,
  error: null
}

// REDUCER
const cptReducer = (state = initialState, action) => {
  switch(action.type) {
    case GET_CPT_BY_ID:
      return { ...state, cpt: action.cptById }

    case UPDATE_CPT:
      return { ...state, cpt: action.updatedCpt }

    case DELETE_CPT:
      return { ...state, cpt: action.deletedCpt }

    case CREATE_CPT:
      return { ...state, cpt: action.createdCpt }

    case GET_ALL_CPT:
      return { ...state, allCpt: action.allCpt }

    case SET_NO_CPT_MSG:
      return { ...state, noCptMsg: action.message }

    case CLEAR_NO_CPT_MSG:
      return { ...state, noCptMsg: null }

    default:
      return state
  }
}

export default cptReducer;