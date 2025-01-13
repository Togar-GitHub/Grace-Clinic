import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk';
import sessionReducer from './session';
import reviewReducer from './review';
import serviceReducer from './service';
import cptReducer from './cpt';
import chartReducer from './chart';
import appointmentReducer from './appointment';

const rootReducer = combineReducers({
  session: sessionReducer,
  review: reviewReducer,
  service: serviceReducer,
  cpt: cptReducer,
  chart: chartReducer,
  appointment: appointmentReducer
});

let enhancer;
if (import.meta.env.MODE === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;