import axios from 'axios';

// ACTIONS
const SET_GAMES = 'SET_GAMES';
const ADD_GAME = 'ADD_GAME';
const COMPLETE_GAME = 'COMPLETE_GAME';

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

const completeGame = game => {
  return {
    type: COMPLETE_GAME,
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

export const addNewGame = game => {
  return async dispatch => {
    try {
      const { data } = await axios.post('/api/games', game);
      dispatch(addGame(data));
    } catch (err) {
      console.log(err);
    }
  };
};

export const completeSingleGame = game => {
  return async dispatch => {
    try {
      const { data } = await axios.put(`/api/games/${game.id}`, game);
      dispatch(completeGame(data));
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
    case ADD_GAME:
      return { ...state, pending: [...state.pending, action.game] };
    case COMPLETE_GAME:
      return {
        completed: [...state.completed, action.game],
        pending: state.pending.filter(game => game.id !== action.game.id),
        weekly: state.weekly.map(game =>
          game.id === action.game.id ? action.game : game
        ),
      };
    default:
      return state;
  }
};
