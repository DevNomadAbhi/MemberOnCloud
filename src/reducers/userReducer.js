import {ACTION_USER_DATA, ACTION_USER_HTTP} from '../Constants';
const initialState = {
  userData: [],
  http: '',
};

const userReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case ACTION_USER_DATA:
      return {...state, userData: payload};
    case ACTION_USER_HTTP:
      return {...state, http: payload};
    default:
      return state;
  }
};
export default userReducer;
