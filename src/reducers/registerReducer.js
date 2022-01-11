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

const initialState = {
  title: '',
  firstName: '',
  lastName: '',
  birthDate: '',
  phoneNum: '',
  password: '',
  machineNum: '',
  pinCode: '',
  sex: '',
  ADDR_1: '',
  ADDR_2: '',
  ADDR_3: '',
  postcode: '',
  email: '',
};

const registerReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case ACTION_SET_FIRSTNAME:
      return {...state, firstName: payload};
    case ACTION_SET_LASTNAME:
      return {...state, lastName: payload};
    case ACTION_SET_NAMETITLE:
      return {...state, title: payload};
    case ACTION_SET_BIRTHDATE:
      return {...state, birthDate: payload};
    case ACTION_SET_PASSWORD:
      return {...state, password: payload};
    case ACTION_SET_PHONENUM:
      return {...state, phoneNum: payload};
    case ACTION_SET_MACHINENUM:
      return {...state, machineNum: payload};
    case ACTION_M_PINCODE:
      return {...state, pinCode: payload};
    case ACTION_SET_SEX:
      return {...state, sex: payload};
    case ACTION_SET_ADDR_1:
      return {...state, ADDR_1: payload};
    case ACTION_SET_ADDR_2:
      return {...state, ADDR_2: payload};
    case ACTION_SET_ADDR_3:
      return {...state, ADDR_3: payload};
    case ACTION_SET_POSTCODE:
      return {...state, postcode: payload};
    case ACTION_SET_EMAIL:
      return {...state, email: payload};

    default:
      return state;
  }
};
export default registerReducer;
