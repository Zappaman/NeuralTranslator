/* eslint-disable import/no-anonymous-default-export */
import { FETCH_FILE, FETCH_FILE_LIST } from '../actions/types';

export default (state = {}, action) => {
  let newState = { ...state };
  switch (action.type) {
    case FETCH_FILE_LIST:
      action.payload['files'].forEach((el) => {
        newState[el] = null;
      });
      return newState;
    case FETCH_FILE:
      newState[action.payload.filename] = action.payload.content;
      return newState;
    default:
      return state;
  }
};
