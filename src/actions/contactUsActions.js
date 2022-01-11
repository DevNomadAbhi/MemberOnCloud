import {
  ACTION_CONU_GETLO_GUID,
  ACTION_CONU_GETLO_NAME,
  ACTION_CONU_GETLO_RESULT,
  ACTION_CONU_GETPAGE_RESULT,
} from '../Constants';
export const LOguid = (payload) => ({
  type: ACTION_CONU_GETLO_GUID,
  payload,
});
export const LOname = (payload) => ({
  type: ACTION_CONU_GETLO_NAME,
  payload,
});
export const LOresult = (payload) => ({
  type: ACTION_CONU_GETLO_RESULT,
  payload,
});
export const PageResult = (payload) => ({
  type: ACTION_CONU_GETPAGE_RESULT,
  payload,
});
