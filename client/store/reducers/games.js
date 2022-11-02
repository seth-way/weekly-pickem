import axios from 'axios';

// ACTIONS
const SET_GAMES = 'SET_GAMES';

// ACTION CREATORS
const setGames = (games, status) => {
  return {
    type: SET_GAMES,
    games,
    status,
  };
};

// THUNKS
export const fetchGames = () => {
  return async dispatch => {
    try {
      const { data } = await axios.get('/api/games');
      const { completedGames, pendingGames } = data;

      dispatch(setGames(completedGames, 'completed'));
      dispatch(setGames(pendingGames, 'pending'));
    } catch (err) {
      console.log(err);
    }
  };
};

// REDUCER
const initialState = { completed: [], pending: [] };

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_GAMES:
      return { ...state, [action.status]: action.games };
    default:
      return state;
  }
};
