import { csrfFetch } from "./csrf";

// ACTION TYPES
const GET_PATIENT_CHARTS = 'chart/GET_PATIENT_CHARTS'
const GET_CHART_BY_ID = 'chart/GET_CHART_BY_ID';
const GET_CHART_BY_CPT = 'chart/GET_CHART_BY_CPT';
const GET_CHART_BY_SERVICE = 'chart/GET_CHART_BY_SERVICE';
const GET_CHART_BY_STAFF = 'chart/GET_CHART_BY_STAFF';
const UPDATE_CHART = 'chart/UPDATE_CHART';
const DELETE_CHART = 'chart/DELETE_CHART';
const CREATE_CHART = 'chart/CREATE_CHART';
const GET_ALL_CHART = 'chart/GET_ALL_CHART';
const RESET_CHARTS = 'chart/RESET_CHARTS';
const SET_NO_CHART_MSG = 'chart/SET_NO_CHART_MSG';
const CLEAR_NO_CHART_MSG = 'chart/CLEAR_NO_CHART_MSG';

// ACTION CREATORS
const getPatientCharts = (allCharts) => {
  return {
    type: GET_PATIENT_CHARTS,
    allCharts
  }
}

const getChartById = (chart) => {
  return {
    type: GET_CHART_BY_ID,
    chart
  }
}

const getChartByCpt = (chart) => {
  return {
    type: GET_CHART_BY_CPT,
    chart
  }
}

const getChartByService = (chart) => {
  return {
    type: GET_CHART_BY_SERVICE,
    chart
  }
}

const getChartByStaff = (chart) => {
  return {
    type: GET_CHART_BY_STAFF,
    chart
  }
}

const updateChart = (chart) => {
  return {
    type: UPDATE_CHART,
    chart
  }
}

const deleteChart = (chart) => {
  return {
    type: DELETE_CHART,
    chart
  }
}

const createChart = (chart) => {
  return {
    type: CREATE_CHART,
    chart
  }
}

const getAllChart = () => {
  return {
    type: GET_ALL_CHART
  }
}

const setNoChartMsg = (message) => {
  return {
    type: SET_NO_CHART_MSG,
    message
  }
}

const clearNoChartMsg = () => {
  return {
    type: CLEAR_NO_CHART_MSG
  }
}

// THUNK
export const getPatientChartsThunk = (patientData) => async (dispatch) => {
  const res = await csrfFetch('/api/chart/patientCharts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patientData)
  })

  if (res.ok) {
    const patientCharts = await res.json();
    dispatch(getPatientCharts(patientCharts));
    dispatch(clearNoChartMsg());
    return patientCharts;
  } else {
    dispatch(setNoChartMsg('No Patient Chart found or failed to get Charts'))
  }
}

export const getChartByIdThunk = (chartId) => async (dispatch) => {
  const res = await csrfFetch(`/api/chart/${chartId}`);

  if (res.ok) {
    const chartById = await res.json();
    dispatch(getChartById(chartById));
    dispatch(clearNoChartMsg());
    return chartById;
  } else {
    dispatch(setNoChartMsg('No Chart found or failed to get a Chart'))
  }
}

export const getChartByCptThunk = (cptId) => async (dispatch) => {
  const res = await csrfFetch(`/api/chart/cpt/${cptId}`);

  if (res.ok) {
    const chartByCpt = await res.json();
    dispatch(getChartByCpt(chartByCpt));
    dispatch(clearNoChartMsg());
    return chartByCpt;
  } else {
    dispatch(setNoChartMsg('No Chart found or failed to get a Chart'))
  }
}

export const getChartByServiceThunk = (serviceId) => async (dispatch) => {
  const res = await csrfFetch(`/api/chart/service/${serviceId}`);

  if (res.ok) {
    const chartByService = await res.json();
    dispatch(getChartByService(chartByService));
    dispatch(clearNoChartMsg());
    return chartByService;
  } else {
    dispatch(setNoChartMsg('No Chart found or failed to get a Chart'))
  }
}

export const getChartByStaffThunk = (userId) => async (dispatch) => {
  const res = await csrfFetch(`/api/chart/staff/${userId}`);

  if (res.ok) {
    const chartByStaff = await res.json();
    dispatch(getChartByStaff(chartByStaff));
    dispatch(clearNoChartMsg());
    return chartByStaff;
  } else {
    dispatch(setNoChartMsg('No Chart found or failed to get a Chart'))
  }
}

export const updateChartThunk = (chartId, incomingChart) => async (dispatch) => {
  const res = await csrfFetch(`/api/chart/${chartId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(incomingChart)  
  })

  if (res.ok) {
    const updatedChart = await res.json();
    dispatch(updateChart(updatedChart));
    dispatch(clearNoChartMsg());
    return updatedChart;
  } else {
    dispatch(setNoChartMsg('No Chart updated or failed to update the Chart'))
  }
}

export const deleteChartThunk = (chartId) => async (dispatch) => {
  const res = await csrfFetch(`/api/chart/${chartId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  })

  if (res.ok) {
    const deletedChart = await res.json();
    dispatch(deleteChart(deletedChart));
    dispatch(clearNoChartMsg());
    return deletedChart;
  } else {
    dispatch(setNoChartMsg('No Chart deleted or failed to delete the Chart'))
  }
}

export const createChartThunk = (incomingChart) => async (dispatch) => {
  const res = await csrfFetch('/api/chart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(incomingChart)
  })

  if (res.ok) {
    const createdChart = await res.json();
    dispatch(createChart(createdChart));
    dispatch(clearNoChartMsg());
    return createdChart;
  } else {
    dispatch(setNoChartMsg('No Chart created or failed to create the Chart'))
  }
}

export const getAllChartThunk = () => async (dispatch) => {
  const res = await csrfFetch('api/chart');

  if (res.ok) {
    const allChart = await res.json();
    dispatch(getAllChart(allChart));
    dispatch(clearNoChartMsg());
    return allChart;
  } else {
    dispatch(setNoChartMsg('No Chart found or failed to get Charts'))
  }
}

export const resetCharts = () => ({
  type: RESET_CHARTS
})

// INITIAL STATE
const initialState = {
  chart: [],
  allCharts: [],
  noChartMsg: null,
  error: null
}

// REDUCER
const chartReducer = (state = initialState, action) => {
  switch(action.type) {
    case GET_PATIENT_CHARTS:
      return { ...state, allCharts: action.allCharts }

    case GET_CHART_BY_ID: 
      return { ...state, chart: action.chart }

    case GET_CHART_BY_CPT:
      return { ...state, chart: action.chart }

    case GET_CHART_BY_SERVICE:
      return { ...state, chart: action.chart }

    case GET_CHART_BY_STAFF:
      return { ...state, chart: action.chart }

    case UPDATE_CHART:
      return { ...state, chart: action.chart }

    case DELETE_CHART:
      return { ...state, chart: action.chart }

    case CREATE_CHART:
      return { ...state, chart: action.chart }

    case GET_ALL_CHART:
      return { ...state, allCharts: action.allChart }

    case RESET_CHARTS:
      return { ...state, allCharts: [] }

    case SET_NO_CHART_MSG:
      return { ...state, noChartMsg: action.message }

    case CLEAR_NO_CHART_MSG:
      return { ...state, noChartMsg: null }

    default:
      return state
  }
}

export default chartReducer;