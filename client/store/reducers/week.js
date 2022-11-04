import axios from 'axios';

// ACTIONS
const SET_WEEK = 'SET_WEEK';

// ACTION CREATORS
const setWeek = week => {
  return {
    type: SET_WEEK,
    week,
  };
};

// THUNKS
export const fetchWeek = week => {
  return async dispatch => {
    try {
      const { data } = await axios.get(`/api/weeks/${week}`);
      dispatch(setWeek(data));
    } catch (err) {
      console.log(err);
    }
  };
};

//REDUCER
const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_WEEK:
      return action.week;
    default:
      return state;
  }
};
