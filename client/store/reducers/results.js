import axios from 'axios';

// ACTIONS
const SET_RESULTS = 'SET_RESULTS';
const CREATE_RESULT = 'CREATE_RESULT';

// ACTION CREATORS
const setResults = results => {
  return {
    type: SET_RESULTS,
    results,
  };
};

const createResult = result => {
  return {
    type: CREATE_RESULT,
    result,
  };
};

// THUNKS
export const fetchResults = () => {
  return async dispatch => {
    try {
      const { data } = await axios.get('/api/results');
      // key is week, value is result
      const resultsObject = data.reduce(
        (obj, result) => ({ ...obj, [result.week]: result }),
        {}
      );
      dispatch(setResults(resultsObject));
    } catch (err) {
      console.log(err);
    }
  };
};

export const createOrUpdateResult = result => {
  return async dispatch => {
    try {
      const { data } = await axios.post('/api/results', result);
      dispatch(createResult(data));
    } catch (err) {
      console.log(err);
    }
  };
};

// REDUCER
const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_RESULTS:
      return action.results;
    case CREATE_RESULT:
      return { ...state, [action.result.week]: action.result };
    default:
      return state;
  }
};
