import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchGames } from '../store/reducers/games';
import Navbar from './Navbar';
import AllResults from './AllResults';
import AllGamesByWeek from './AllGamesByWeek';

class App extends React.Component {
  componentDidMount() {
    this.props.loadGames();
  }

  render() {
    return (
      <div id='main'>
        <div>
          <Navbar />
        </div>
        <Routes>
          <Route path='/' element={<AllResults />} />
          <Route path='/picks/:week' element={<AllGamesByWeek />} />
        </Routes>
      </div>
    );
  }
}

const mapState = state => ({
  games: state.games,
});

const mapDispatch = dispatch => ({
  loadGames: () => dispatch(fetchGames()),
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
