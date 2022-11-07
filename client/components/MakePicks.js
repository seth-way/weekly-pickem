import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import { fetchPicksByWeek, createUserPicks } from '../store/reducers/picks';

const createPicksObject = games => {
  const picks = {};

  games.forEach(game => {
    const { id, away, home, spread, start, week } = game;
    picks[game.id] = {
      gameId: id,
      away,
      home,
      spread,
      start,
      week,
      choice: null,
      userId: null,
    };
  });

  return picks;
};
class MakePicks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      week: 0,
      picks: [],
      pendingPicks: {},
      homePts: null,
      awayPts: null,
      picksMade: false,
      user: {},
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    const { latestWeek, games, picks, user, fetchPicks } = this.props;
    const { pending } = games;
    const pendingPicks = createPicksObject(pending);
    Object.keys(pendingPicks).forEach(key => {
      pendingPicks[key].userId = this.props.user.id;
    });
    fetchPicks(latestWeek);
    this.setState({
      week: latestWeek,
      pendingPicks,
      picks,
      user,
    });
  }

  async componentDidUpdate(prev) {
    const { latestWeek, games, user, picks, fetchPicks } = this.props;
    const { pending } = games;

    if (prev.latestWeek !== latestWeek) {
      fetchPicks(latestWeek);
      this.setState({ week: latestWeek });
    }
    if (prev.picks.length !== picks.length) {
      this.setState({ picks });
    }
    if (prev.games.pending.length !== pending.length) {
      const pendingPicks = createPicksObject(pending);
      Object.keys(pendingPicks).forEach(key => {
        pendingPicks[key].userId = this.props.user.id;
      });
      this.setState({ pendingPicks });
      this.render();
    }
    if (prev.user.id !== user.id) {
      const pendingPicks = createPicksObject(pending);
      Object.keys(pendingPicks).forEach(key => {
        pendingPicks[key].userId = this.props.user.id;
      });
      this.setState({ pendingPicks, user });
      this.render();
    }
  }

  handleClick(e) {
    e.preventDefault();
    const gameId = e.target.getAttribute('gameId');
    const choice = e.target.getAttribute('choice');
    const { pendingPicks } = this.state;
    pendingPicks[gameId].choice = choice;
    this.setState({ pendingPicks });
  }

  handleInputChange(e) {
    this.setState({ [e.target.id]: e.target.value });
  }

  async handleSubmit(e) {
    e.preventDefault();
    const { pendingPicks } = this.state;
    const homePts = parseInt(this.state.homePts);
    const awayPts = parseInt(this.state.awayPts);
    const { createPicks } = this.props;
    const allPicksMade = Object.values(pendingPicks).reduce(
      (cumm, pick) => cumm && pick.choice !== null,
      true
    );
    if (!allPicksMade) {
      alert('MAKE ALL PICKS BEFORE SUBMITTING');
    } else if (isNaN(homePts) || isNaN(awayPts)) {
      alert('Use valid scores for tie breaker');
    } else {
      const picks = Object.values(pendingPicks).map(pick => {
        const { choice, gameId, userId } = pick;
        return { choice, gameId, userId };
      });
      picks[picks.length - 1].homePts = +homePts;
      picks[picks.length - 1].awayPts = +awayPts;
      await createPicks(picks);
      this.setState({ picksMade: true });
    }
  }

  render() {
    const { week, picks, pendingPicks, picksMade, homePts, awayPts, user } =
      this.state;

    if (picksMade) return <Navigate to={`/games/${week}`} />;

    if (!Object.keys(user).length) return <div>Log In to Make Picks</div>;
    if (!Object.keys(pendingPicks).length)
      return <div>This weeks games are not ready yet</div>;

    const weeksPicks = picks.filter(pick => pick.game.week === week);
    const userPicks = weeksPicks.filter(pick => pick.userId === user.id);
    console.log('make picks rendered with user id....', user.id);
    console.log('weeks picks are.....', weeksPicks);
    console.log('users picks are.....', userPicks);
    if (userPicks.length) {
      return <div>You have already made this weeks picks</div>;
    }
    const currentDate = new Date();

    Object.entries(pendingPicks).forEach(([key, pick]) => {
      if (new Date(pick.start) < currentDate) delete pendingPicks[key];
    });

    const upcomingGames = Object.values(pendingPicks);
    upcomingGames.sort((a, b) => new Date(a.start) - new Date(b.start));

    return (
      <Table bordered hover variant='dark'>
        <thead>
          <tr>
            <th colSpan='3'>{`Make Your Picks.... Week ${week}`}</th>
          </tr>
          <tr>
            <th>Away</th>
            <th>Spread</th>
            <th>Home</th>
          </tr>
        </thead>
        <tbody>
          {upcomingGames.map(game => (
            <tr>
              <td
                className={game.spread < 0 ? 'border border-info border-2' : ''}
              >
                <Image
                  className={
                    game.choice === null
                      ? ''
                      : game.choice === game.away
                      ? 'chosen'
                      : 'other'
                  }
                  src={`/logos/${game.away}.png`}
                  gameId={game.gameId}
                  choice={game.away}
                  onClick={this.handleClick}
                />
              </td>
              <td>{game.spread}</td>
              <td
                className={game.spread > 0 ? 'border border-info border-2' : ''}
              >
                <Image
                  className={
                    game.choice === null
                      ? ''
                      : game.choice === game.home
                      ? 'chosen'
                      : 'other'
                  }
                  src={`/logos/${game.home}.png`}
                  gameId={game.gameId}
                  choice={game.home}
                  onClick={this.handleClick}
                />
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <Form.Label htmlFor='spread' visuallyHidden>
                Spread
              </Form.Label>
              <Form.Control
                className='mb-2'
                id='awayPts'
                placeholder='Away Pts'
                onChange={this.handleInputChange}
                value={awayPts}
              />
            </td>
            <td>Tie Breaker</td>
            <td>
              <Form.Label htmlFor='spread' visuallyHidden>
                Spread
              </Form.Label>
              <Form.Control
                className='mb-2'
                id='homePts'
                placeholder='Home Pts'
                onChange={this.handleInputChange}
                value={homePts}
              />
            </td>
          </tr>
          <tr>
            <td colSpan='3'>
              <Button type='button' onClick={this.handleSubmit}>
                Submit Picks
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
    );
  }
}

const mapState = state => ({
  user: state.user,
  games: state.games,
  picks: state.picks,
});

const mapDispatch = dispatch => ({
  fetchPicks: week => dispatch(fetchPicksByWeek(week)),
  createPicks: picks => dispatch(createUserPicks(picks)),
});

export default connect(mapState, mapDispatch)(MakePicks);
