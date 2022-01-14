import {
  ACTION_ACT_GETLO_GUID,
  ACTION_ACT_GETLO_NAME,
  ACTION_ACT_GETLO_RESULT,
  ACTION_ACT_GETPAGE_GUID,
  ACTION_ACT_GETPAGE_RESULT,
  ACTION_ACT_GETCON_NAME,
  ACTION_ACT_GETCON_RESULT,
  ACTION_ACT_GETCON_LASTUPDATE,
} from '../Constants';
export const LOguid = (payload) => ({
  type: ACTION_ACT_GETLO_GUID,
  payload,
});
export const LOname = (payload) => ({
  type: ACTION_ACT_GETLO_NAME,
  payload,
});
export const LOresult = (payload) => ({
  type: ACTION_ACT_GETLO_RESULT,
  payload,
});
export const PageGuid = (payload) => ({
  type: ACTION_ACT_GETPAGE_GUID,
  payload,
});
export const PageResult = (payload) => ({
  type: ACTION_ACT_GETPAGE_RESULT,
  payload,
});
export const ConName = (payload) => ({
  type: ACTION_ACT_GETCON_NAME,
  payload,
});
export const ConResult = (payload) => ({
  type: ACTION_ACT_GETCON_RESULT,
  payload,
});
export const lastupdate = (payload) => ({
  type: ACTION_ACT_GETCON_LASTUPDATE,
  payload,
});

