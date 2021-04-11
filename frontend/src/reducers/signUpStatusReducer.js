/* eslint-disable import/no-anonymous-default-export */
import { SET_SIGNUP_STATUS } from '../actions/types';

export default (state = { is_ok: null, msg: null }, action) => {
  switch (action.type) {
    case SET_SIGNUP_STATUS:
      return action.payload;
    default:
      return state;
  }
};
