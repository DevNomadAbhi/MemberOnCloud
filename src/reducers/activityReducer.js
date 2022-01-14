import {
  ACTION_ACT_GETLO_GUID,
  ACTION_ACT_GETLO_NAME,
  ACTION_ACT_GETLO_RESULT,
  ACTION_ACT_GETPAGE_GUID,
  ACTION_ACT_GETPAGE_RESULT,
  ACTION_ACT_GETCON_NAME,
  ACTION_ACT_GETCON_RESULT,
  ACTION_ACT_GETCON_LASTUPDATE,
} from '../Constants'
const initialState = {
    LOguid: [],
    LOname: [],
    LOresult: [],
    pageGuid: [],
    pageResult: [],
    conName: true,
    conResult: '',
    lastupdate:''
  }
  
  const activityReducer = (state = initialState, {type, payload}) => {
    switch (type) {
      case ACTION_ACT_GETLO_GUID:
        return {...state, LOguid: payload};
      case ACTION_ACT_GETLO_NAME:
        return {...state, LOname: payload};
      case ACTION_ACT_GETLO_RESULT:
        return {...state, LOresult: payload};
      case ACTION_ACT_GETPAGE_GUID:
        return {...state, pageGuid: payload};
      case ACTION_ACT_GETPAGE_RESULT:
        return {...state, pageResult: payload};
      case ACTION_ACT_GETCON_NAME:
        return {...state, conName: payload};
      case ACTION_ACT_GETCON_RESULT:
        return {...state, conResult: payload};
        case ACTION_ACT_GETCON_LASTUPDATE:
          return {...state, lastupdate: payload};
      default:
        return state;
    }
  };
  export default activityReducer;