import React, { Component } from 'react';
import { connect } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/InputGroup';
import Table from 'react-bootstrap/Table';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import { fetchWeek } from '../store/reducers/week';
import { addNewGame } from '../store/reducers/games';
import teams from '../../bin/teams';

const weeks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

class AddGames extends Component {
  constructor(props) {
    super(props);
    this.state = {
      week: null,
      games: [],
      away: null,
      home: null,
      spread: 0,
      month: 11,
      day: 1,
      hour: 1,
    };

    this.handleWeekChange = this.handleWeekChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  /*
  async componentDidUpdate(prev) {
    if (
      prev.week.games !== this.props.week.games ||
      (prev.week.games &&
        this.props.week.games &&
        Object.keys(prev.week.games).length !==
          Object.keys(this.props.week.games).length)
    ) {
      const { week } = this.state;
      if (week) {
        const games = [];

        await this.props.fetchSingleWeek(week);

        if (this.props.week.games) {
          Object.values(this.props.week.games).forEach(game => {
            const { id, away, home, spread, start } = game;
            games.push({ id, away, home, spread, start });
          });
        }

        games.sort((a, b) => new Date(a.start) - new Date(b.start));

        this.setState({ games });
      }
    }
  }
  */
  async handleWeekChange(e) {
    const week = e.target.value;
    const games = [];

    await this.props.fetchSingleWeek(week);

    if (this.props.week.games) {
      Object.values(this.props.week.games).forEach(game => {
        const { id, away, home, spread, start } = game;
        games.push({ id, away, home, spread, start });
      });
    }

    games.sort((a, b) => new Date(a.start) - new Date(b.start));

    this.setState({ week, games });
  }

  handleInputChange(e) {
    this.setState({ [e.target.id]: e.target.value });
  }

  async handleSubmit(e) {
    e.preventDefault();
    let { away, home, spread, month, day, hour, week } = this.state;

    if (!away || !home) return;
    [spread, month, day, hour] = [spread, month, day, hour].map(val =>
      parseInt(val)
    );

    if (isNaN(spread) || isNaN(month) || isNaN(day) || isNaN(hour)) return;
    if (hour < 10) hour += 12;

    const start = new Date(2022, month - 1, day, hour);
    await this.props.addGame({ away, home, spread, start, week });

    const games = [];

    await this.props.fetchSingleWeek(week);

    if (this.props.week.games) {
      Object.values(this.props.week.games).forEach(game => {
        const { id, away, home, spread, start } = game;
        games.push({ id, away, home, spread, start });
      });
    }

    games.sort((a, b) => new Date(a.start) - new Date(b.start));

    this.setState({
      games,
      away: null,
      home: null,
      spread: 0,
      month: 11,
      day: 1,
      hour: 1,
    });

    this.render();
  }

  render() {
    const { user } = this.props;
    const { games, week, spread, away } = this.state;

    if (!Object.keys(user).length || !user.admin)
      return <div>Must be an admin to visit this page</div>;
    return (
      <div className='add_games_container'>
        <Form.Control as='select' onChange={this.handleWeekChange}>
          <option value='null'>Select A Week</option>
          {weeks.map(week => (
            <option value={week}>{`Week ${week}`}</option>
          ))}
        </Form.Control>
        {/* ---> Form for creating new game <--- */}
        {week ? (
          <Form className='form' onSubmit={this.handleSubmit}>
            <Row className='align-items-center'>Create New Game</Row>
            <Row className='align-items-center'>
              <Col xs='auto'>
                <Form.Select
                  aria-label='Away Team'
                  className='mb-2'
                  id='away'
                  onChange={this.handleInputChange}
                >
                  <option value='null'>Away Team</option>
                  {teams.map(team => (
                    <option value={team}>{team}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col xs='auto'>
                <Form.Label htmlFor='spread' visuallyHidden>
                  Spread
                </Form.Label>
                <Form.Control
                  className='mb-2'
                  id='spread'
                  placeholder='Spread'
                  onChange={this.handleInputChange}
                  value={spread}
                />
              </Col>
              <Col xs='auto'>
                <Form.Select
                  aria-label='Home Team'
                  className='mb-2'
                  id='home'
                  onChange={this.handleInputChange}
                >
                  <option value='null'>Home Team</option>
                  {teams.map(team => (
                    <option value={team}>{team}</option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
            <Row className='align-items-center'>
              {/* date time picker needs to go here */}
              <Col xs='auto'>
                <Form.Label htmlFor='month' visuallyHidden>
                  Month
                </Form.Label>
                <Form.Control
                  className='mb-2'
                  id='month'
                  placeholder='Month'
                  onChange={this.handleInputChange}
                />
              </Col>
              <Col xs='auto'>
                <Form.Label htmlFor='day' visuallyHidden>
                  Day
                </Form.Label>
                <Form.Control
                  className='mb-2'
                  id='day'
                  placeholder='Day'
                  onChange={this.handleInputChange}
                />
              </Col>
              <Col xs='auto'>
                <Form.Label htmlFor='hour' visuallyHidden>
                  Hour
                </Form.Label>
                <Form.Control
                  className='mb-2'
                  id='hour'
                  placeholder='Hour'
                  onChange={this.handleInputChange}
                />
              </Col>
            </Row>
            <Button variant='primary' type='submit'>
              Submit
            </Button>
          </Form>
        ) : (
          ''
        )}
        {/* ---> Table of this weeks games <--- */}
        {games.length ? (
          <Table bordered hover variant='dark'>
            <thead>
              <tr>
                <th colSpan='4'>{`Week ${week} Games`}</th>
              </tr>
              <tr>
                <th>Away</th>
                <th>Spread</th>
                <th>Home</th>
                <th>Start Time</th>
              </tr>
            </thead>
            <tbody>
              {games.map(game => (
                <tr>
                  <td>
                    <Image src={`/logos/${game.away}.png`} />
                  </td>
                  <td>{game.spread}</td>
                  <td>
                    <Image src={`/logos/${game.home}.png`} />
                  </td>
                  <td>{new Date(game.start).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          ''
        )}
      </div>
    );
  }
}

const mapState = state => ({
  user: state.user,
  week: state.week,
});

const mapDispatch = dispatch => ({
  fetchSingleWeek: week => dispatch(fetchWeek(week)),
  addGame: game => dispatch(addNewGame(game)),
});

export default connect(mapState, mapDispatch)(AddGames);
