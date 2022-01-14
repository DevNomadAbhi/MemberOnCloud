import {
  ACTION_NOTI_GETLO_GUID,
  ACTION_NOTI_GETLO_NAME,
  ACTION_NOTI_GETLO_RESULT,
  ACTION_NOTI_GETPAGE_GUID,
  ACTION_NOTI_GETPAGE_STATUS

} from '../Constants';
export const LOguid = (payload) => ({
    type: ACTION_NOTI_GETLO_GUID,
    payload,
  });
  export const LOname = (payload) => ({
    type: ACTION_NOTI_GETLO_NAME,
    payload,
  });
  export const LOresult = (payload) => ({
    type: ACTION_NOTI_GETLO_RESULT,
    payload,
  });
  export const PageGuid = (payload) => ({
    type: ACTION_NOTI_GETPAGE_GUID,
    payload,
  });
  export const readStatus = (payload) => ({
    type: ACTION_NOTI_GETPAGE_STATUS,
    payload,
  });
  