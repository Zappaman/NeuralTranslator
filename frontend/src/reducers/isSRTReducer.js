/* eslint-disable import/no-anonymous-default-export */
import { SET_IS_SRT } from '../actions/types';

export default (state = false, action) => {
  switch (action.type) {
    case SET_IS_SRT:
      return action.payload;
    default:
      return state;
  }
};
