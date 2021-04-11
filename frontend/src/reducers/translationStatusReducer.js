/* eslint-disable import/no-anonymous-default-export */
import { SET_TRANSLATE_STATUS_IN_PROGRESS, SET_TRANSLATE_STATUS_DONE } from '../actions/types';

export default (state = false, action) => {
  switch (action.type) {
    case SET_TRANSLATE_STATUS_IN_PROGRESS:
      return true;
    case SET_TRANSLATE_STATUS_DONE:
      return false;
    default:
      return state;
  }
};
