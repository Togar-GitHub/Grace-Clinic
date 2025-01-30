import { csrfFetch } from './csrf';

// ACTION TYPES
const GET_PATIENT_APPOINTMENTS = 'appointment/GET_PATIENT_APPOINTMENTS'
const GET_APPOINTMENTS_ADMIN = 'appointment/GET_APPOINTMENTS_ADMIN';
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
const RESET_APPOINTMENTS = 'appointment/RESET_APPOINTMENTS';
const SET_NO_APPOINTMENT_MSG = 'appointment/SET_NO_APPOINTMENT_MSG';
const CLEAR_NO_APPOINTMENT_MSG = 'appointment/CLEAR_NO_APPOINTMENT_MSG';

// ACTION CREATORS
const getPatientAppointments = (allAppointments) => {
  return {
    type: GET_PATIENT_APPOINTMENTS,
    allAppointments
  }
}

const getAppointmentsAdmin = (allAppointments) => {
  return {
    type: GET_APPOINTMENTS_ADMIN,
    allAppointments
  }
}

const deleteAppointmentAdmin = (appointment) => {
  return {
    type: DELETE_APPOINTMENT_ADMIN,
    appointment
  }
}

const updateAppointmentAdmin = (appointment) => {
  return {
    type: UPDATE_APPOINTMENT_ADMIN,
    appointment
  }
}

const updateAppointmentChart = (appointment) => {
  return {
    type: UPDATE_APPOINTMENT_CHART,
    appointment  
  }
}

const getAppointmentCurrent = (allAppointments) => {
  return {
    type: GET_APPOINTMENT_CURRENT,
    allAppointments
  }
}

const getSpecAppointment = (appointment) => {
  return {
    type: GET_SPEC_APPOINTMENT,
    appointment
  }
}

const getAppointmentById = (appointment) => {
  return {
    type:GET_APPOINTMENT_BY_ID,
    appointment
  }
}

const updateAppointmentCurrent = (appointment) => {
  return {
    type: UPDATE_APPOINTMENT_CURRENT,
    appointment
  }
}

const deleteAppointmentCurrent = (appointment) => {
  return {
    type: DELETE_APPOINTMENT_CURRENT,
    appointment
  }
}

const createAppointmentCurrent = (appointment) => {
  return {
    type: CREATE_APPOINTMENT_CURRENT,
    appointment
  }
}

const getAllAppointments = (allAppointments) => {
  return {
    type: GET_ALL_APPOINTMENTS,
    allAppointments
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
export const getPatientAppointmentsThunk = (patientData) => async (dispatch) => {
  const res = await csrfFetch('/api/appointment/patientAppointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patientData)
  })

  if (res.ok) {
    const patientAppointments = await res.json();
    dispatch(getPatientAppointments(patientAppointments));
    dispatch(clearNoAppointmentMsg());
    return patientAppointments;
  } else {
    dispatch(setNoAppointmentMsg('No Appointments or failed to fetch Appointments'))
  }
}

export const getAppointmentsAdminThunk = () => async (dispatch) => {
  const res = await csrfFetch('/api/appointment/admin')

  if (res.ok) {
    const appointmentsAdmin = await res.json();
    dispatch(getAppointmentsAdmin(appointmentsAdmin));
    dispatch(clearNoAppointmentMsg());
    return appointmentsAdmin;
  } else {
    dispatch(setNoAppointmentMsg('No Appointments or failed to fetch Appointments'))
  }
}

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

export const resetAppointments = () => ({
  type: RESET_APPOINTMENTS
})

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
    case GET_PATIENT_APPOINTMENTS:
      return { ...state, allAppointments: action.allAppointments }

    case GET_APPOINTMENTS_ADMIN:
      return { ...state, allAppointments: action.allAppointments }

    case DELETE_APPOINTMENT_ADMIN:
      return { ...state, appointment: action.appointment }

     case UPDATE_APPOINTMENT_ADMIN:
      return { ...state, appointment: action.appointment } 

    case UPDATE_APPOINTMENT_CHART:
      return { ...state, appointment: action.appointment }

    case GET_APPOINTMENT_CURRENT:
      return { ...state, allAppointments: action.allAppointments }

    case GET_SPEC_APPOINTMENT:
      return { ...state, appointment: action.appointment }

    case GET_APPOINTMENT_BY_ID:
      return { ...state, appointment: action.appointment }

    case UPDATE_APPOINTMENT_CURRENT:
      return { ...state, appointment: action.appointment }

    case DELETE_APPOINTMENT_CURRENT:
      return { ...state, appointment: action.appointment }

    case CREATE_APPOINTMENT_CURRENT:
      return { ...state, appointment: action.appointment }

    case GET_ALL_APPOINTMENTS:
      return { ...state, allAppointments: action.allAppointments }

    case RESET_APPOINTMENTS:
      return { ...state, allAppointments: [] }

    case SET_NO_APPOINTMENT_MSG:
      return { ...state, noAppointmentMsg: action.message }

    case CLEAR_NO_APPOINTMENT_MSG:
      return { ...state, noAppointmentMsg: null }

    default:
      return state
  }
}

export default appointmentReducer;