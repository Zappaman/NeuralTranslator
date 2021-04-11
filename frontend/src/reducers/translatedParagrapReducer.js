/* eslint-disable import/no-anonymous-default-export */
import { SET_TRANSLATED_PARAGRAPH } from '../actions/types';

export default (state = '', action) => {
  switch (action.type) {
    case SET_TRANSLATED_PARAGRAPH:
      return action.payload;
    default:
      return state;
  }
};
