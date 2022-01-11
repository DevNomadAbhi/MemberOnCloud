import {
  ACTION_SET_FIRSTNAME,
  ACTION_SET_LASTNAME,
  ACTION_SET_NAMETITLE,
  ACTION_SET_BIRTHDATE,
  ACTION_SET_PHONENUM,
  ACTION_SET_PASSWORD,
  ACTION_SET_MACHINENUM,
  ACTION_M_PINCODE,
  ACTION_SET_SEX,
  ACTION_SET_ADDR_1,
  ACTION_SET_ADDR_2,
  ACTION_SET_ADDR_3,
  ACTION_SET_POSTCODE,
  ACTION_SET_EMAIL,

} from '../Constants';

export const firstName = (payload) => ({
  type: ACTION_SET_FIRSTNAME,
  payload,
});
export const lastName = (payload) => ({
  type: ACTION_SET_LASTNAME,
  payload,
});
export const nameTitle = (payload) => ({
  type: ACTION_SET_NAMETITLE,
  payload,
});
export const birthDate = (payload) => ({
  type: ACTION_SET_BIRTHDATE,
  payload,
});
export const password = (payload) => ({
  type: ACTION_SET_PASSWORD,
  payload,
});
export const phoneNum = (payload) => ({
  type: ACTION_SET_PHONENUM,
  payload,
});
export const machine = (payload) => ({
  type: ACTION_SET_MACHINENUM,
  payload,
});
export const pinCode = (payload) => ({
  type: ACTION_M_PINCODE,
  payload,
});
export const sex = (payload) => ({
  type: ACTION_SET_SEX,
  payload,
});
export const ADDR_1 = (payload) => ({
  type: ACTION_SET_ADDR_1,
  payload,
});
export const ADDR_2 = (payload) => ({
  type: ACTION_SET_ADDR_2,
  payload,
});
export const ADDR_3 = (payload) => ({
  type: ACTION_SET_ADDR_3,
  payload,
});
export const postcode = (payload) => ({
  type: ACTION_SET_POSTCODE,
  payload,
});
export const email = (payload) => ({
  type: ACTION_SET_EMAIL,
  payload,
});

