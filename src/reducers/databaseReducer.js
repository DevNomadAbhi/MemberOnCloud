import {ACTION_DATA} from '../Constants';
const initialState = {
  Data: {},
};

const databaseReducer = (state = initialState, {type, payload}) => {
  switch (type) {
    case ACTION_DATA:
      return {...state, Data: payload};
    default:
      return state;
  }
};
export default databaseReducer;
