import {
  ACTION_IMG_INTEREST,

} from '../Constants';

const initialState = {
  interestImg: [],

};

const interestReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case ACTION_IMG_INTEREST:
      return {...state, interestImg: payload};
    default:
      return state;
  }
};
export default interestReducer;
