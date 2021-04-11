/* eslint-disable import/no-anonymous-default-export */
import { FETCH_USER } from '../actions/types';

export default (state = { user: {} }, action) => {
  switch (action.type) {
    case FETCH_USER:
      return action.payload;
    default:
      return state;
  }
};
