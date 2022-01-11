import {
  ACTION_SET_GETLO_GUID,
  ACTION_SET_GETLO_NAME,
  ACTION_SET_GETLO_RESULT,
  ACTION_SET_GETPAGE_GUID,
  ACTION_SET_GETPAGE_NAME,
  ACTION_SET_GETPAGE_RESULT,
} from '../Constants';

const initialState = {
  LOguid: [],
  LOname: [],
  LOresult: [],
  pageGuid: [],
  pageName: [],
  pageResult: [],
};

const redeemReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case ACTION_SET_GETLO_GUID:
      return {...state, LOguid: payload};
    case ACTION_SET_GETLO_NAME:
      return {...state, LOname: payload};
    case ACTION_SET_GETLO_RESULT:
      return {...state, LOresult: payload};
    case ACTION_SET_GETPAGE_GUID:
      return {...state, pageGuid: payload};
    case ACTION_SET_GETPAGE_NAME:
      return {...state, pageName: payload};
    case ACTION_SET_GETPAGE_RESULT:
      return {...state, pageResult: payload};
    default:
      return state;
  }
};
export default redeemReducer;
