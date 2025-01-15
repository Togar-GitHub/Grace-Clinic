import { csrfFetch } from './csrf';

// ACTION TYPES
const DELETE_APPOINTMENT_ADMIN = 'appointment/DELETE_APPOINTMENT_ADMIN';
const UPDATE_APPOINTMENT_ADMIN = 'appointment/UPDATE_APPOINTMENT_ADMIN';
const UPDATE_APPOINTMENT_CHART = 'appointment/UPDATE_APPOINTMENT_CHART';
const GET_APPOINTMENT_CURRENT = 'appointment/GET_APPOINTMENT_CURRENT';
const GET_SPEC_APPOINTMENT = 'appointment/GET_SPEC_APPOINTMENT';
const GET_APPOINTMENT_BY_ID = 'appointment/GET_APPOINTMENT_BY_ID';
const UPDATE_APPOINTMENT_CURRENT = 'appointment/UPDATE_APPOINTMENT_CURRENT';
const DELETE_APPOINTMENT_CURRENT = 'appointment/DELETE_APPOINTMENT_CURRENT';
const CREATE_APPOINTMENT_CURRENT = 'appointment/CREATE_APPOINTMENT_CURRENT';
const GET_ALL_APPOINTMENTS = 'appointment/GET_ALL_APPOINTMENTS';
const SET_NO_APPOINTMENT_MSG = 'appointment/SET_NO_APPOINTMENT_MSG';
const CLEAR_NO_APPOINTMENT_MSG = 'appointment/CLEAR_NO_APPOINTMENT_MSG';

// ACTION CREATORS
const deleteAppointmentAdmin = (appointmentId) => {
  return {
    type: DELETE_APPOINTMENT_ADMIN,
    appointmentId
  }
}

const updateAppointmentAdmin = (appointmentId, incomingAppointment) => {
  return {
    type: UPDATE_APPOINTMENT_ADMIN,
    appointmentId,
    incomingAppointment
  }
}

const updateAppointmentChart = (appointmentId, incomingAppointment) => {
  return {
    type: UPDATE_APPOINTMENT_CHART,
    appointmentId,
    incomingAppointment
  }
}

const getAppointmentCurrent = (allAppointments) => {
  return {
    type: GET_APPOINTMENT_CURRENT,
    gotAppointmentCurrent: allAppointments
  }
}

const getSpecAppointment = (incomingData) => {
  return {
    type: GET_SPEC_APPOINTMENT,
    incomingData
  }
}

const getAppointmentById = (appointmentId) => {
  return {
    type:GET_APPOINTMENT_BY_ID,
    appointmentId
  }
}

const updateAppointmentCurrent = (appointmentId, incomingAppointment) => {
  return {
    type: UPDATE_APPOINTMENT_CURRENT,
    appointmentId,
    incomingAppointment
  }
}

const deleteAppointmentCurrent = (appointmentId) => {
  return {
    type: DELETE_APPOINTMENT_CURRENT,
    appointmentId
  }
}

const createAppointmentCurrent = (incomingAppointment) => {
  return {
    type: CREATE_APPOINTMENT_CURRENT,
    incomingAppointment
  }
}

const getAllAppointments = () => {
  return {
    type: GET_ALL_APPOINTMENTS
  }
}

const setNoAppointmentMsg = (message) => {
  return {
    type: SET_NO_APPOINTMENT_MSG,
    message
  }
}

const clearNoAppointmentMsg = () => {
  return {
    type: CLEAR_NO_APPOINTMENT_MSG
  }
}

// THUNK
export const deleteAppointmentAdminThunk = (appointmentId) => async (dispatch) => {
  const res = await csrfFetch(`/api/appointment/admin/${appointmentId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  })

  if (res.ok) {
    const deletedAppointmentAdmin = await res.json();
    dispatch(deleteAppointmentAdmin(deletedAppointmentAdmin));
    dispatch(clearNoAppointmentMsg());
    return deletedAppointmentAdmin;
  } else {
    dispatch(setNoAppointmentMsg('No Appointment deleted or failed to delete an Appointment'))
  }
}

export const updateAppointmentAdminThunk = (appointmentId, incomingAppointment) => async (dispatch) => {
  const res = await csrfFetch(`/api/appointment/admin/${appointmentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(incomingAppointment)
  })

  if (res.ok) {
    const updatedAppointmentAdmin = await res.json();
    dispatch(updateAppointmentAdmin(updatedAppointmentAdmin));
    dispatch(clearNoAppointmentMsg());
    return updatedAppointmentAdmin
  } else {
    dispatch(setNoAppointmentMsg('No Appointment updated or failed to update an Appointment'))
  }
}

export const updateAppointmentChartThunk = (appointmentId, incomingAppointment) => async (dispatch) => {
  const res = await csrfFetch(`/api/appointment/chart/${appointmentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(incomingAppointment)
  })

  if (res.ok) {
    const updatedAppointmentChart = await res.json();
    dispatch(updateAppointmentChart(updatedAppointmentChart));
    dispatch(clearNoAppointmentMsg());
    return updatedAppointmentChart;
  } else {
    dispatch(setNoAppointmentMsg('No Appointment updated or failed to update an Appointment'))
  }
}

export const getAppointmentCurrentThunk = () => async (dispatch) => {
  const res = await csrfFetch('/api/appointment/current');

  if (res.ok) {
    const gotAppointmentCurrent = await res.json();
    dispatch(getAppointmentCurrent(gotAppointmentCurrent));
    dispatch(clearNoAppointmentMsg());
    return gotAppointmentCurrent;
  } else {
    dispatch(setNoAppointmentMsg('No Appointment found or failed to get Appointments'))
  }
}

export const getSpecAppointmentThunk = (incomingData) => async (dispatch) => {
  console.log('frontend > ', incomingData);
  const res = await csrfFetch('/api/appointment/specAppointment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(incomingData)
  });

  if (res.ok) {
    const specAppointment = await res.json();
    dispatch(getSpecAppointment(specAppointment));
    dispatch(clearNoAppointmentMsg());
    return specAppointment;
  } else {
    dispatch(setNoAppointmentMsg('No Appointment found or failed to get Appointments'));
    return null;
  }  

  // if (res.ok) {
  //   const specAppointment = await res.json();
  //   dispatch(getSpecAppointment(specAppointment));
  //   dispatch(clearNoAppointmentMsg());
  //   return specAppointment;
  // } else {
  //   dispatch(setNoAppointmentMsg('No Appointment found or failed to get Appointments'));
  //   return null;
  // }
}

export const getAppointmentByIdThunk = (appointmentId) => async (dispatch) => {
  const res = await csrfFetch(`/api/appointment/${appointmentId}`);

  if (res.ok) {
    const gotAppointmentById = await res.json();
    dispatch(getAppointmentById(gotAppointmentById));
    dispatch(clearNoAppointmentMsg());
    return gotAppointmentById;
  } else {
    dispatch(setNoAppointmentMsg('No Appointment found or failed to get Appointments'))
  }
}

export const updateAppointmentCurrentThunk = (appointmentId, incomingAppointment) => async (dispatch) => {
  const res = await csrfFetch(`/api/appointment/${appointmentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(incomingAppointment)
  })

  if (res.ok) {
    const updatedAppointmentCurrent = await res.json();
    dispatch(updateAppointmentCurrent(updatedAppointmentCurrent));
    dispatch(clearNoAppointmentMsg());
    return updatedAppointmentCurrent;
  } else {
    dispatch(setNoAppointmentMsg('No Appointment updated or failed to update an Appointment'))
  }
}

export const deleteAppointmentCurrentThunk = (appointmentId) => async (dispatch) => {
  const res = await csrfFetch(`/api/appointment/${appointmentId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  })

  if (res.ok) {
    const deletedAppointmentCurrent = await res.json();
    dispatch(deleteAppointmentCurrent(deletedAppointmentCurrent));
    dispatch(clearNoAppointmentMsg());
    return deletedAppointmentCurrent;
  } else {
    dispatch(setNoAppointmentMsg('No Appointment deleted or failed to delete an Appointment'))
  }
}

export const createAppointmentCurrentThunk = (incomingAppointment) => async (dispatch) => {
  const res = await csrfFetch('/api/appointment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(incomingAppointment)
  })

  if (res.ok) {
    const createdAppointmentCurrent = await res.json();
    dispatch(createAppointmentCurrent(createdAppointmentCurrent));
    dispatch(clearNoAppointmentMsg());
    return createdAppointmentCurrent;
  } else {
    dispatch(setNoAppointmentMsg('No Appointment created or failed to create an Appointment'))
  }
}

export const getAllAppointmentsThunk = () => async (dispatch) => {
  const res = await fetch('/api/appointment');

  if (res.ok) {
    const gotAllAppointments = await res.json();
    dispatch(getAllAppointments(gotAllAppointments));
    dispatch(clearNoAppointmentMsg());
    return gotAllAppointments;
  } else {
    dispatch(setNoAppointmentMsg('No Appointment found or failed to get Appointments'))
  }
}

// INITIAL STATE
const initialState = {
  appointment: [],
  allAppointments: [],
  noAppointmentMsg: null,
  error: null
}

// REDUCER
const appointmentReducer = (state = initialState, action) => {
  switch(action.type) {
    case DELETE_APPOINTMENT_ADMIN:
      return { ...state, appointment: action.deletedAppointmentAdmin }

     case UPDATE_APPOINTMENT_ADMIN:
      return { ...state, appointment: action.updatedAppointmentAdmin } 

    case UPDATE_APPOINTMENT_CHART:
      return { ...state, appointment: action.updatedAppointmentChart }

    case GET_APPOINTMENT_CURRENT:
      return { ...state, allAppointments: action.gotAppointmentCurrent }

    case GET_SPEC_APPOINTMENT:
      return { ...state, appointment: action.specAppointment }

    case GET_APPOINTMENT_BY_ID:
      return { ...state, appointment: action.gotAppointmentById }

    case UPDATE_APPOINTMENT_CURRENT:
      return { ...state, appointment: action.updatedAppointmentCurrent }

    case DELETE_APPOINTMENT_CURRENT:
      return { ...state, appointment: action.deletedAppointmentCurrent }

    case CREATE_APPOINTMENT_CURRENT:
      return { ...state, appointment: action.createdAppointmentCurrent }

    case GET_ALL_APPOINTMENTS:
      return { ...state, allAppointments: action.gotAllAppointments }

    case SET_NO_APPOINTMENT_MSG:
      return { ...state, noAppointmentMsg: action.message }

    case CLEAR_NO_APPOINTMENT_MSG:
      return { ...state, noAppointmentMsg: null }

    default:
      return state
  }
}

export default appointmentReducer;