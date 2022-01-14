import {
  ACTION_CONU_GETLO_GUID,
  ACTION_CONU_GETLO_NAME,
  ACTION_CONU_GETLO_RESULT,
  ACTION_CONU_GETPAGE_RESULT,
} from '../Constants';
const initialState = {
  LOguid: [],
  LOname: [],
  LOresult: [],
  pageResult: [],
}

const contactUsReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case ACTION_CONU_GETLO_GUID:
      return {...state, LOguid: payload};
    case ACTION_CONU_GETLO_NAME:
      return {...state, LOname: payload};
    case ACTION_CONU_GETLO_RESULT:
      return {...state, LOresult: payload};
    case ACTION_CONU_GETPAGE_RESULT:
      return {...state, pageResult: payload};

    default:
      return state;
  }
}

export default contactUsReducer;
