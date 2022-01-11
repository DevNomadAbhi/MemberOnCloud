import {ACTION_USER_DATA, ACTION_USER_HTTP} from '../Constants';

export const setUserData = (payload) => ({
  type: ACTION_USER_DATA,
  payload,
});

export const setUserHttp = (payload) => ({
  type: ACTION_USER_HTTP,
  payload,
});
