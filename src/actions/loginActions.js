import {
  ACTION_LOGIN,
  ACTION_USERLOGIN,
  ACTION_SET_GUID,
  ACTION_SET_JSONRESULT,
  ACTION_SET_SERVICEID,
  ACTION_SET_USERNAMESER,
  ACTION_SET_PASSWORDSER,
  LOGIN_SET_USERNAME,
  LOGIN_SET_PASSWORD,
  ACTION_SET_PROJECTID,
  ACTION_SET_INDEX,
  ACTION_SET_IP_ADDRESS,
  ACTION_SET_FINGERPRINT,
  ACTION_SET_SCREEN,
  ACTION_SET_LANGUAGE
} from '../Constants';

export const login = (payload) => ({
  type: ACTION_LOGIN,
  payload,
});
export const userlogin = (payload) => ({
  type: ACTION_USERLOGIN,
  payload,
});
export const guid = (payload) => ({
  type: ACTION_SET_GUID,
  payload,
});
export const jsonResult = (payload) => ({
  type: ACTION_SET_JSONRESULT,
  payload,
});
export const serviceID = (payload) => ({
  type: ACTION_SET_SERVICEID,
  payload,
});
export const userNameSer = (payload) => ({
  type: ACTION_SET_USERNAMESER,
  payload,
});
export const passwordSer = (payload) => ({
  type: ACTION_SET_PASSWORDSER,
  payload,
});
export const userName = (payload) => ({
  type: LOGIN_SET_USERNAME,
  payload,
});
export const password = (payload) => ({
  type: LOGIN_SET_PASSWORD,
  payload,
});
export const projectId = (payload) => ({
  type: ACTION_SET_PROJECTID,
  payload,
});
export const index = (payload) => ({
  type: ACTION_SET_INDEX,
  payload,
});
export const ipAddress = (payload) => ({
  type: ACTION_SET_IP_ADDRESS,
  payload,
});
export const setFingerprint = (payload) => ({
  type: ACTION_SET_FINGERPRINT,
  payload,
});
export const setScreen = (payload) => ({
  type: ACTION_SET_SCREEN,
  payload,
});
export const setLanguage = (payload) => ({
  type: ACTION_SET_LANGUAGE,
  payload,
});