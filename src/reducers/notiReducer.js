import {
  ACTION_NOTI_GETLO_GUID,
  ACTION_NOTI_GETLO_NAME,
  ACTION_NOTI_GETLO_RESULT,
  ACTION_NOTI_GETPAGE_GUID,
} from '../Constants';
const initialState = {
  LOguid: [],
  LOname: [],
  LOresult: [],
  pageGuid: [],
};

const notiReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case ACTION_NOTI_GETLO_GUID:
      return {...state, LOguid: payload};
    case ACTION_NOTI_GETLO_NAME:
      return {...state, LOname: payload};
    case ACTION_NOTI_GETLO_RESULT:
      return {...state, LOresult: payload};
    case ACTION_NOTI_GETPAGE_GUID:
      return {...state, pageGuid: payload};
    default:
      return state;
  }
};
export default notiReducer;
