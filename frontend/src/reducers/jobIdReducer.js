/* eslint-disable import/no-anonymous-default-export */
import { SET_JOB_ID } from '../actions/types';

export default (state = null, action) => {
  switch (action.type) {
    case SET_JOB_ID:
      return action.payload.jobId;
    default:
      return state;
  }
};
