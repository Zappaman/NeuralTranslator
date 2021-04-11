/* eslint-disable import/no-anonymous-default-export */
import { SET_TRANSLATION_PARAGRAPH } from '../actions/types';

export default (state = 'Type your text here', action) => {
  switch (action.type) {
    case SET_TRANSLATION_PARAGRAPH:
      return action.payload;
    default:
      return state;
  }
};
