/* eslint-disable import/no-anonymous-default-export */
import { SET_ACTIVE_PANE_ITEM } from '../actions/types';

export default (state = 'file', action) => {
  switch (action.type) {
    case SET_ACTIVE_PANE_ITEM:
      return action.payload;
    default:
      return state;
  }
};
