import {
    ACTION_CAM_GETLO_GUID,
    ACTION_CAM_GETLO_NAME,
    ACTION_CAM_GETLO_RESULT,
    ACTION_CAM_GETPAGE_GUID,
    ACTION_CAM_GETPAGE_NAME,
    ACTION_CAM_GETPAGE_RESULT,
  } from '../Constants';
  
  export const LOguid = (payload) => ({
      type: ACTION_CAM_GETLO_GUID,
      payload,
    });
    export const LOname = (payload) => ({
      type: ACTION_CAM_GETLO_NAME,
      payload,
    });
    export const LOresult = (payload) => ({
      type: ACTION_CAM_GETLO_RESULT,
      payload,
    });
    export const PageGuid = (payload) => ({
      type: ACTION_CAM_GETPAGE_GUID,
      payload,
    });
    export const PageName = (payload) => ({
      type: ACTION_CAM_GETPAGE_NAME,
      payload,
    });
    export const PageResult = (payload) => ({
      type: ACTION_CAM_GETPAGE_RESULT,
      payload,
    });
