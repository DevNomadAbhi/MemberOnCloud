import {
  PROMO_ACT_GETLO_SPAGE,
  PROMO_ACT_GETLO_PAGE,
  PROMO_ACT_GETLO_INFO,
  PROMO_ACT_GETCON_LASTUPDATE,
} from '../Constants'
const initialState = {
  spage: [],
  page: [],
  info: [],
  lastupdate: ''
}

const activityReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case PROMO_ACT_GETLO_SPAGE:
      return { ...state, spage: payload };
    case PROMO_ACT_GETLO_PAGE:
      return { ...state, page: payload };
    case PROMO_ACT_GETLO_INFO:
      return { ...state, info: payload };
    case PROMO_ACT_GETCON_LASTUPDATE:
      return { ...state, lastupdate: payload };
    default:
      return state;
  }
};
export default activityReducer;