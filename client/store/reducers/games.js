import axios from 'axios';

// ACTIONS
const SET_GAMES = 'SET_GAMES';
const ADD_GAME = 'ADD_GAME';

// ACTION CREATORS
const setGames = (games, status) => {
  return {
    type: SET_GAMES,
    games,
    status,
  };
};

const addGame = game => {
  return {
    type: ADD_GAME,
    game,
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

export const fetchGamesByWeek = week => {
  return async dispatch => {
    try {
      const { data } = await axios.get(`/api/games/${week}`);
      dispatch(setGames(data, 'weekly'));
    } catch (err) {
      console.log(err);
    }
  };
};

export const addNewGame = game => {
  console.log('THUNK HIT.... GAME INFO.... ', game);
  return async dispatch => {
    try {
      const { data } = await axios.post('/api/games', game);
      dispatch(addGame(data));
    } catch (err) {
      console.log(err);
    }
  };
};

// REDUCER
const initialState = { completed: [], pending: [], weekly: [] };

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_GAMES:
      return { ...state, [action.status]: action.games };
    case ADD_GAME:
      return { ...state, pending: [...state.pending, action.game] };
    default:
      return state;
  }
};
