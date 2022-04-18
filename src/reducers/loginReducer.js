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
  SERVICE_ID,
  USERNAME_SERVICE,
  PASSWORD_SERVICE,
  USERNAME_SER,
  PASSWORD_SER,
  PROJECT_ID,
  ACTION_SET_LANGUAGE
} from '../Constants';

const initialState = {
  loggedIn: false,
  userloggedIn: false,
  guid: '',
  jsonResult: [],
  serviceID: SERVICE_ID,
  userNameSer: USERNAME_SERVICE,
  passwordSer: PASSWORD_SERVICE,
  userName: USERNAME_SER,
  password: PASSWORD_SER,
  projectID: PROJECT_ID,
  index: '-1',
  ipAddress: [],
  isFingerprint: false,
  isScreen: '',
  language: 'th'
}

const loginReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ACTION_LOGIN:
      return { ...state, loggedIn: payload }
    case ACTION_USERLOGIN:
      return { ...state, userloggedIn: payload }
    case ACTION_SET_GUID:
      return { ...state, guid: payload }
    case ACTION_SET_JSONRESULT:
      return { ...state, jsonResult: payload }
    case ACTION_SET_SERVICEID:
      return { ...state, serviceID: payload }
    case ACTION_SET_USERNAMESER:
      return { ...state, userNameSer: payload }
    case ACTION_SET_PASSWORDSER:
      return { ...state, passwordSer: payload }
    case LOGIN_SET_USERNAME:
      return { ...state, userName: payload }
    case LOGIN_SET_PASSWORD:
      return { ...state, password: payload }
    case ACTION_SET_PROJECTID:
      return { ...state, projectID: payload }
    case ACTION_SET_INDEX:
      return { ...state, index: payload }
    case ACTION_SET_IP_ADDRESS:
      return { ...state, ipAddress: payload }
    case ACTION_SET_FINGERPRINT:
      return { ...state, isFingerprint: payload }
    case ACTION_SET_SCREEN:
      return { ...state, isScreen: payload }
    case ACTION_SET_LANGUAGE:
      return { ...state, language: payload }
    default:
      return state;
  }
};
export default loginReducer;