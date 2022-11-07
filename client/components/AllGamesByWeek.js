import React from 'react';
import { connect } from 'react-redux';
import Table from 'react-bootstrap/Table';
import Image from 'react-bootstrap/Image';
import { fetchWeek } from '../store/reducers/week';

class AllGamesByWeek extends React.Component {
  constructor(props) {
    super(props);
    this.state = { games: {}, users: {} };
  }

  componentDidMount() {
    const { fetchSingleWeek } = this.props;
    // get current week from URL
    const week = +window.location.href.split('/').pop();
    fetchSingleWeek(week);
  }

  componentDidUpdate(prev) {
    if (
      JSON.stringify(prev.week.games) !== JSON.stringify(this.props.week.games)
    ) {
      this.setState({
        games: this.props.week.games,
        users: this.props.week.users,
      });
    }
  }

  render() {
    let { games, users } = this.state;
    const { user } = this.props;
    let maxCorrect = 0;

    // ensure games have been posted for this week
    if (!games || !Object.keys(games).length)
      return <div>{`No Games Posted for this Week!`}</div>;

    const { week } = Object.values(games)[0];
    // ensure user is signed in
    if (!user.id)
      return <div>{`Sign in to view Week ${week} Games and Picks`}</div>;

    // ensure user has made picks for this week
    if (!(user.id in Object.values(games)[0].picks))
      return (
        <div>
          {`Make your picks for week ${week} before viewing the rest of the leagues
        picks!`}
        </div>
      );

    const numCols = Object.values(users).length
      ? 6 + Object.values(users).length
      : 5;
    maxCorrect = Math.max(...Object.values(users).map(user => user.correct));

    return (
      <Table bordered hover variant='dark'>
        <thead>
          <tr>
            <th colSpan={numCols}>{`WEEK ${week} GAMES`}</th>
          </tr>
          <tr>
            <th>Pts</th>
            <th>Away</th>
            <th>Spread</th>
            <th>Home</th>
            <th>Pts</th>
            {/* Add blank column between game headers and user names */}
            {Object.keys(users).length ? <th></th> : ''}
            {/* Add heading for each users picks */}
            {Object.values(users).map(user => (
              <th>{user.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.values(games).map(game => (
            <tr>
              <td>{game.awayPts !== null ? game.awayPts : ''}</td>
              <td
                className={game.spread < 0 ? 'border border-info border-2' : ''}
              >
                <Image
                  src={`/logos/${game.away}.png`}
                  className={
                    game.winner === null
                      ? ''
                      : game.winner === game.away
                      ? 'winner'
                      : 'loser'
                  }
                />
              </td>
              <td>{game.spread}</td>
              <td
                className={game.spread > 0 ? 'border border-info border-2' : ''}
              >
                <Image
                  src={`/logos/${game.home}.png`}
                  className={
                    game.winner === null
                      ? ''
                      : game.winner === game.home
                      ? 'winner'
                      : 'loser'
                  }
                />
              </td>
              <td>{game.homePts !== null ? game.homePts : ''}</td>
              {/* Add spacer column between games and picks */}
              {Object.values(game.picks).length ? <td></td> : ''}
              {/* Add any picks in same row as each game */}
              {Object.values(game.picks).map(pick => (
                <td>
                  <Image
                    src={`/logos/${pick}.png`}
                    className={
                      game.winner === null
                        ? ''
                        : game.winner === pick
                        ? 'winner'
                        : 'loser'
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
          {/* Add Tie Breakers to each users picks */}
          {Object.values(users).length ? (
            <tr>
              <td />
              <td />
              <td />
              <td />
              <td />
              <td />
              {Object.values(users).map(user => (
                <td>{`${user.tbAway} - ${user.tbHome}`}</td>
              ))}
            </tr>
          ) : (
            ''
          )}
          {/* Add Users records to user picks */}
          {Object.values(users).length ? (
            <tr>
              <td />
              <td />
              <td />
              <td />
              <td />
              <td />
              {Object.values(users).map(user => (
                <td
                  className={user.correct === maxCorrect ? 'leader' : 'other'}
                >{`${user.correct} / ${user.correct + user.incorrect}`}</td>
              ))}
            </tr>
          ) : (
            ''
          )}
        </tbody>
      </Table>
    );
  }
}

const mapState = state => ({
  week: state.week,
  user: state.user,
});

const mapDispatch = dispatch => ({
  fetchSingleWeek: week => dispatch(fetchWeek(week)),
});

export default connect(mapState, mapDispatch)(AllGamesByWeek);
