import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchGames } from '../store/reducers/games';
import Navbar from './Navbar';
import AllResults from './AllResults';
import AllGamesByWeek from './AllGamesByWeek';
import AddGames from './AddGames';
import UpdateGames from './UpdateGames';

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
        <div id='body'>
          <Routes>
            <Route path='/' element={<AllResults />} />
            <Route exact path='/games/:week' element={<AllGamesByWeek />} />
            <Route exact path='/admin/addGames' element={<AddGames />} />
            <Route exact path='/admin/updateGames' element={<UpdateGames />} />
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
