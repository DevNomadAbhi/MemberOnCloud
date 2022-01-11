import {SIGNOUT_REQUEST} from '../Constants';

const initialState = {};

const signoutReducer= (state = initialState, {type}) => {
  switch (type) {
    case SIGNOUT_REQUEST:
      return {...state};

    default:
      return state;
  }
};
export default signoutReducer;