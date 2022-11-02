import axios from 'axios';

// ACTIONS
const SET_PICKS = 'SET_PICKS';

// ACTION CREATORS
const setPicks = picks => {
  return {
    type: SET_PICKS,
    picks,
  };
};

// THUNKS
export const fetchPicks = () => {
  return async dispatch => {
    try {
      const { data } = await axios.get('/api/picks');
      dispatch(setPicks(data));
    } catch (err) {
      console.log(err);
    }
  }
}

export const fetchPicksByWeek = week => {
  return async dispatch => {
    try {
      const { data } = await axios.get(`/api/picks/${week}`);
      dispatch(setPicks(data));
    } catch (err) {
      console.log(err);
    }
  }
}

// REDUCER
const initialState = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PICKS:
      return action.picks;
    default:
      return state;
  }
};
