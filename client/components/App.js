import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchGames } from '../store/reducers/games';
import { fetchResults } from '../store/reducers/results';
import Navbar from './Navbar';
import AllResults from './AllResults';
import AllGamesByWeek from './AllGamesByWeek';
import AddGames from './AddGames';
import UpdateScores from './UpdateScores';
import MakePicks from './MakePicks';
import AddResults from './AddResults';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { latestWeek: 0 };
  }
  componentDidMount() {
    this.props.loadGames();
    this.props.loadResults();
  }

  componentDidUpdate(prev) {
    const { pending } = this.props.games;
    if (prev.games.pending.length !== pending.length) {
      const latestWeek = Math.max(...pending.map(game => game.week));
      this.setState({ latestWeek });
    }
  }

  render() {
    const { latestWeek } = this.state;

    return (
      <div id='main'>
        <div>
          <Navbar latestWeek={latestWeek} />
        </div>
        <div id='body'>
          <Routes>
            <Route path='/' element={<AllResults />} />
            <Route exact path='/games/:week' element={<AllGamesByWeek />} />
            <Route exact path='/admin/addGames' element={<AddGames />} />
            <Route
              exact
              path='/admin/updateScores'
              element={<UpdateScores />}
            />
            <Route exact path='/admin/addResults' element={<AddResults />} />
            <Route
              path='makePicks'
              element={<MakePicks latestWeek={latestWeek} />}
            />
          </Routes>
        </div>
      </div>
    );
  }
}

const mapState = state => ({
  games: state.games,
});

const mapDispatch = dispatch => ({
  loadGames: () => dispatch(fetchGames()),
  loadResults: () => dispatch(fetchResults()),
});

export default connect(mapState, mapDispatch)(App);

//// on page load....
// fetch all picks where pick.success === null
// check if game is completed
// update pick.sucess
//// fetch all picks where pick.success !== null
// sort by player for graph
//// fetch all games (with picks associated)
// sort by week
