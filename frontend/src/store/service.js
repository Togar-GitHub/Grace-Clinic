import { csrfFetch } from "./csrf";

// ACTION TYPES
const GET_SERVICE_BY_ID = 'service/GET_SERVICE_BY_ID';
const UPDATE_SERVICE = 'service/UPDATE_SERVICE';
const DELETE_SERVICE = 'service/DELETE_SERVICE';
const CREATE_SERVICE = 'service/CREATE_SERVICE';
const GET_ALL_SERVICES = 'service/GET_ALL_SERVICES';
const SET_NO_SERVICE_MSG = 'service/SET_NO_SERVICE_MSG';
const CLEAR_NO_SERVICE_MSG = 'service/CLEAR_NO_SERVICE_MSG';

// ACTION CREATORS
const getServiceById = (serviceId) => {
  return {
    type: GET_SERVICE_BY_ID,
    serviceId
  }
}

const updateService = (serviceId, incomingService) => {
  return {
    type: UPDATE_SERVICE,
    serviceId,
    incomingService
  }
}

const deleteService = (serviceId) => {
  return {
    type: DELETE_SERVICE,
    serviceId
  }
}

const createService = (incomingService) => {
  return {
    type: CREATE_SERVICE,
    incomingService
  }
}

const getAllServices = (allServices) => {
  return {
    type: GET_ALL_SERVICES,
    allServices
  }
}

const setNoServiceMsg = (message) => {
  return {
    type: SET_NO_SERVICE_MSG,
    message
  }
}

const clearNoServiceMsg = () => {
  return {
    type: CLEAR_NO_SERVICE_MSG
  }
}

// THUNK
export const getServiceByIdThunk = (serviceId) => async (dispatch) => {
  const res = await csrfFetch(`/api/service/${serviceId}`);

  if (res.ok) {
    const serviceById = await res.json();
    dispatch(getServiceById(serviceById));
    dispatch(clearNoServiceMsg())
    return serviceById;
  } else {
    dispatch(setNoServiceMsg('No Service found or failed to fetch Service'))
  }
}

export const updateServiceThunk = (serviceId, incomingService) => async (dispatch) => {
  const res = await csrfFetch(`/api/service/${serviceId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(incomingService)
  })

  if (res.ok) {
    const updatedService = await res.json();
    dispatch(updateService(updatedService));
    dispatch(clearNoServiceMsg());
    return updatedService;
  } else {
    dispatch(setNoServiceMsg('Service is not updated or failed to update Service'))
  }
}

export const deleteServiceThunk = (serviceId) => async (dispatch) => {
  const res = await csrfFetch(`/api/service/${serviceId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  })

  if (res.ok) {
    const deletedService = await res.json();
    dispatch(deleteService(deletedService));
    dispatch(clearNoServiceMsg());
    return deletedService;
  } else {
    dispatch(setNoServiceMsg('Service is not deleted or failed to delete Service'))
  }
}

export const createServiceThunk = (incomingService) => async (dispatch) => {
  const res = await csrfFetch('/api/service', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(incomingService)
  })

  if (res.ok) {
    const createdService = await res.json();
    dispatch(createService(createdService));
    dispatch(clearNoServiceMsg());
    return createService;
  } else {
    dispatch (setNoServiceMsg('Service is not created or failed to create Service'))
  }
}

export const getAllServicesThunk = () => async (dispatch) => {
  const res = await fetch('/api/service');

  if (res.ok) {
    const allServices = await res.json();
    dispatch(getAllServices(allServices));
    dispatch(clearNoServiceMsg());
    return allServices;
  } else {
    dispatch (setNoServiceMsg('No Services found or failed to fetch Services'))
  }
}

// INITIAL STATE
const initialState = {
  service: [],
  allServices: [],
  noServiceMsg: null,
  error: null
}

// REDUCER
const serviceReducer = (state = initialState, action) => {
  switch(action.type) {
    case GET_SERVICE_BY_ID:
      return { ...state, service: action.serviceById }

    case UPDATE_SERVICE:
      return { ...state, service: action.updatedService }

    case DELETE_SERVICE:
      return { ...state, service: action.deletedService }

    case CREATE_SERVICE:
      return { ...state, service: action.createdService }

    case GET_ALL_SERVICES:
      return { ...state, allServices: action.allServices }

    case SET_NO_SERVICE_MSG:
      return { ...state, noServiceMsg: action.message }

    case CLEAR_NO_SERVICE_MSG:
      return { ...state, noServiceMsg: null }

    default:
      return state
  }
}

export default serviceReducer;