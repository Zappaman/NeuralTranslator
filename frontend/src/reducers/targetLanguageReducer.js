/* eslint-disable import/no-anonymous-default-export */
import { SET_TARGET_LANGUAGE } from '../actions/types';

export default (state = 'Romanian', action) => {
  switch (action.type) {
    case SET_TARGET_LANGUAGE:
      return action.payload['language'];
    default:
      return state;
  }
};
