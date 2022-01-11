import {
  ACTION_LOGIN,
  ACTION_SET_GUID,
  ACTION_SET_JSONRESULT,
  ACTION_SET_SERVICEID,
  ACTION_SET_USERNAMESER,
  ACTION_SET_PASSWORDSER,
  ACTION_SET_PROJECTID,
  ACTION_SET_INDEX,
  ACTION_SET_IP_ADDRESS,
  ACTION_SET_FINGERPRINT,
  SERVICE_ID,
  USERNAME_SERVICE,
  PASSWORD_SERVICE,
  PROJECT_ID,
} from '../Constants';

const initialState = {
  loggedIn: false,
  guid: '',
  jsonResult: [],
  serviceID: SERVICE_ID,
  userNameSer: USERNAME_SERVICE,
  passwordSer: PASSWORD_SERVICE,
  projectID: PROJECT_ID,
  index: '-1',
  ipAddress: [],
  isFingerprint: false,
};

const loginReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case ACTION_LOGIN:
      return {...state, loggedIn: payload};
    case ACTION_SET_GUID:
      return {...state, guid: payload};
    case ACTION_SET_JSONRESULT:
      return {...state, jsonResult: payload};
    case ACTION_SET_SERVICEID:
      return {...state, serviceID: payload};
    case ACTION_SET_USERNAMESER:
      return {...state, userNameSer: payload};
    case ACTION_SET_PASSWORDSER:
      return {...state, passwordSer: payload};
    case ACTION_SET_PROJECTID:
      return {...state, projectID: payload};
    case ACTION_SET_INDEX:
      return {...state, index: payload};
    case ACTION_SET_IP_ADDRESS:
      return {...state, ipAddress: payload};
    case ACTION_SET_FINGERPRINT:
      return {...state, isFingerprint: payload};
    default:
      return state;
  }
};
export default loginReducer;
