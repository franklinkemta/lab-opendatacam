import { fromJS } from 'immutable'
import axios from 'axios';

import { fetchCountingData } from './CounterStateManagement';

// Initial state
const initialState = fromJS({
  urlData: {},
  isCounting: false,
  showCounterData: false,
  drawInstructionsShown: false
})

// Actions
const START_COUNTING = 'App/START_COUNTING'
const STOP_COUNTING = 'App/STOP_COUNTING'
const HIDE_COUNTERDATA = 'App/HIDE_COUNTERDATA'

const DRAW_INSTRUCTIONS_SHOWN = 'App/DRAW_INSTRUCTIONS_SHOWN'

const SET_URLDATA = 'App/SET_URLDATA'

export function startCounting () {
  return (dispatch, getState) => {

    // Ping webservice to start yolo and shutdown webcam stream
    axios.post('/counter/start',{
      countingAreas: getState().counter.get('countingAreas').toJS()
    });

    // Fetch counting data
    dispatch(fetchCountingData());

    // Notify UI we start counting
    dispatch(setIsCounting());
  }
}

export function setIsCounting() {
  return {
    type: START_COUNTING
  }
}

export function showCountingView() {
  return (dispatch, getState) => {

    // Fetch counting data
    dispatch(fetchCountingData());

    // Notify UI we start counting
    dispatch(setIsCounting());
  }
}

export function stopCounting() {
  return (dispatch, getState) => {
    // Ping webservice to start yolo and shutdown webcam stream
    axios.get('/counter/stop');

    // Notify UI we start counting
    dispatch({
      type: STOP_COUNTING
    })
  }
}

function getURLData(req) {
  let protocol = 'http';
  if(req.headers['x-forwarded-proto'] === 'https') {
    protocol = 'https';
  }

  const parsedUrl = req.get('Host').split(':');
  if(parsedUrl.length > 1) {
    return {
      address: parsedUrl[0],
      port: parsedUrl[1],
      protocol
    }
  } else {
    return {
      address: parsedUrl[0],
      port: 80,
      protocol
    }
  }
}

export function setURLData(req) {
  return {
    type: SET_URLDATA,
    payload: getURLData(req)
  }
}

export function drawInstructionsShown() {
  return {
    type: DRAW_INSTRUCTIONS_SHOWN
  }
}

export function hideCountingData() {
  return {
    type: HIDE_COUNTERDATA
  }
}

// Reducer
export default function AppReducer (state = initialState, action = {}) {
  switch (action.type) {
    case START_COUNTING:
      return state.set('isCounting', true).set('showCounterData', true)
    case STOP_COUNTING:
      return state.set('isCounting', false).set('showCounterData', true)
    case HIDE_COUNTERDATA:
      return state.set('showCounterData', false)
    case SET_URLDATA:
      return state.set('urlData', fromJS(action.payload))
    case DRAW_INSTRUCTIONS_SHOWN:
      return state.set('drawInstructionsShown', true)
    default:
      return state
  }
}
