import axios from 'axios';

// ACTIONS
const SET_USER = 'SET_USER';

// ACTION CREATORS
export const setUser = user => {
  return {
    type: SET_USER,
    user,
  };
};

// THUNKS
export const fetchUser = id => {
  return async dispatch => {
    try {
      if (!id) {
        dispatch(setUser({}));
      } else {
        const { data } = await axios.get(`/api/users/${id}`);
        dispatch(setUser(data));
      }
    } catch (err) {
      console.log(err);
    }
  };
};

// REDUCER
const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return action.user;
    default:
      return state;
  }
};
