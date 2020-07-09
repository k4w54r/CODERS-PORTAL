import uuid from 'uuid/v4';
import { SET_ALERT, REMOVE_ALERT } from './types';

export const setAlert = (msg, alertType, timeout = 5000) => (dispatch) => {
  const id = uuid();
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id },
  });

  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
  //After 5s, REMOVE_ALERT will be dispatched
};

//We have an action named setAlert which will dispatch the type of SET_ALERT to the reducer which will add the alert to the state which was initially an empty array
