import {
  PROMO_ACT_GETLO_SPAGE,
  PROMO_ACT_GETLO_PAGE,
  PROMO_ACT_GETLO_INFO,
  PROMO_ACT_GETCON_LASTUPDATE,
} from '../Constants';
export const spage = (payload) => ({
  type: PROMO_ACT_GETLO_SPAGE,
  payload,
});
export const page = (payload) => ({
  type: PROMO_ACT_GETLO_PAGE,
  payload,
});
export const info = (payload) => ({
  type: PROMO_ACT_GETLO_INFO,
  payload,
});
 
export const lastupdate = (payload) => ({
  type: PROMO_ACT_GETCON_LASTUPDATE,
  payload,
});

