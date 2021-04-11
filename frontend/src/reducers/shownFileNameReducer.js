/* eslint-disable import/no-anonymous-default-export */
import { SET_FILENAME } from '../actions/types';

export default (state = null, action) => {
  switch (action.type) {
    case SET_FILENAME:
      return action.payload;
    default:
      return state;
  }
};
