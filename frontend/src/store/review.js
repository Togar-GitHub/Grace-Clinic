import { csrfFetch } from './csrf';

// ACTION TYPES
const GET_CURRENT_REVIEWS = 'review/GET_CURRENT_REVIEWS';
const GET_REVIEW_BY_ID = 'review/GET_REVIEW_BY_ID';
const UPDATE_REVIEW = 'review/UPDATE_REVIEW';
const DELETE_REVIEW = 'review/DELETE_REVIEW';
const CREATE_REVIEW = 'review/CREATE_REVIEW';
const GET_ALL_REVIEWS = 'review/GET_ALL_REVIEWS';
const SET_NO_REVIEW_MSG = 'review/SET_NO_REVIEW_MSG';
const CLEAR_NO_REVIEW_MSG = 'review/CLEAR_NO_REVIEW_MSG';

// ACTION CREATORS
const getCurrentReviews = (allReviews) => {
  return {
    type: GET_CURRENT_REVIEWS,
    allReviews
  }
}

const getReviewById = (reviewId) => {
  return {
    type: GET_REVIEW_BY_ID,
    reviewId
  }
}

const updateReview = (reviewId, incomingReview) => {
  return {
    type: UPDATE_REVIEW,
    reviewId,
    incomingReview
  }
}

const deleteReview = (reviewId) => {
  return {
    type: DELETE_REVIEW,
    reviewId
  }
}

const createReview = (incomingReview) => {
  return {
    type: CREATE_REVIEW,
    incomingReview
  }
}

const getAllReviews = (allReviews) => {
  return {
    type: GET_ALL_REVIEWS,
    allReviews
  }
}

const setNoReviewMsg = (message) => {
  return {
    type: SET_NO_REVIEW_MSG,
    message
  }
}

const clearNoReviewMsg = () => {
  return {
    type: CLEAR_NO_REVIEW_MSG
  }
}

// THUNK
export const getCurrentReviewsThunk = () => async (dispatch) => {
  const res = await csrfFetch('/api/review/current');

  if (res.ok) {
    const reviewByCurrent = await res.json();
    dispatch(getCurrentReviews(reviewByCurrent));
    dispatch(clearNoReviewMsg());
    return reviewByCurrent;
  } else {
    dispatch(setNoReviewMsg('No Reviews found or failed to fetch Reviews'))
  }
}

export const getReviewByIdThunk = (reviewId) => async (dispatch) => {
  const res = await csrfFetch(`/api/review/${reviewId}`);

  if (res.ok) {
    const reviewById = await res.json();
    dispatch(getReviewById(reviewById));
    dispatch(clearNoReviewMsg());
    return reviewById;
  } else {
    dispatch(setNoReviewMsg('No Review found or failed to fetch a Review'))
  }
}

export const updateReviewThunk = (reviewId, incomingReview) => async (dispatch) => {
  const res = await csrfFetch(`/api/review/${reviewId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(incomingReview)
  })

  if (res.ok) {
    const updatedReview = await res.json();
    dispatch(updateReview(updatedReview));
    dispatch(clearNoReviewMsg());
    return updatedReview;
  } else {
    dispatch(setNoReviewMsg('Review is not updated or failed to update the Review'))
  }
}

export const deleteReviewThunk = (reviewId) => async (dispatch) => {
  const res = await csrfFetch(`/api/review/${reviewId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  })

  if (res.ok) {
    const deletedReview = await res.json();
    dispatch(deleteReview(deletedReview));
    dispatch(clearNoReviewMsg());
    return deletedReview;
  } else {
    dispatch(setNoReviewMsg('Review is not deleted or failed to delete a Review'))
  }
}

export const createReviewThunk = (incomingReview) => async (dispatch) => {
  const res = await csrfFetch('/api/review', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(incomingReview)
  })

  if (res.ok) {
    const createdReview = await res.json();
    dispatch(createReview(createdReview));
    dispatch(clearNoReviewMsg());
    return createdReview;
  } else {
    dispatch(setNoReviewMsg('Review is not created or failed to create Review'))
  }
}

export const getAllReviewsThunk = () => async (dispatch) => {
  const res = await fetch('/api/review');

  if (res.ok) {
    const allReviews = await res.json();
    dispatch(getAllReviews(allReviews));
    dispatch(clearNoReviewMsg());
    return allReviews
  } else {
    dispatch(setNoReviewMsg('Reviews not found or failed to get Reviews'))
  }
}

// INITIAL STATE
const initialState = {
  review: [],
  allReviews: [],
  noReviewMsg: null,
  error: null
}

// REDUCER
const reviewReducer = (state = initialState, action) => {
  switch(action.type) {
    case GET_CURRENT_REVIEWS:
      return { ...state, allReviews: action.allReviews } 

    case GET_REVIEW_BY_ID:
      return { ...state, review: action.reviewById }

    case UPDATE_REVIEW:
      return { ...state, review: action.updatedReview } 

    case DELETE_REVIEW:
      return { ...state, review: action.deletedReview }

    case CREATE_REVIEW:
      return { ...state, review: action.createdReview }

    case GET_ALL_REVIEWS:
      return { ...state, allReviews: action.allReviews }

    case SET_NO_REVIEW_MSG:
      return { ...state, noReviewMsg: action.message }

    case CLEAR_NO_REVIEW_MSG:
      return { ...state, noReviewMsg: null }

    default:
      return state
  }
}

export default reviewReducer;