import React, { Component } from 'react';
import { connect } from 'react-redux';
import Table from 'react-bootstrap/Table';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { completeSingleGame } from '../store/reducers/games';

class UpdateScores extends Component {
  constructor(props) {
    super(props);
    const { pending } = this.props.games;
    this.state = { pending };

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidUpdate(prev) {
    const { pending } = this.props.games;
    if (prev.games.pending.length !== pending.length) {
      this.setState({ pending });
    }
  }

  async handleClick(e) {
    e.preventDefault();
    const id = e.target.value;
    const awayPts = parseInt(document.getElementById(`${id}-awayPts`).value);
    const homePts = parseInt(document.getElementById(`${id}-homePts`).value);
    if (isNaN(awayPts) || isNaN(homePts)) return;
    await this.props.completeGame({ id, awayPts, homePts });
    this.render();
  }

  render() {
    const { user } = this.props;
    const { pending } = this.state;

    if (!Object.keys(user).length || !user.admin)
      return <div>Must be an admin to visit this page</div>;

    if (!pending.length) return <div>No Pending Games to Update</div>;

    return (
      <Table bordered hover variant='dark'>
        <thead>
          <tr>
            <th colSpan='6'>Games To Update</th>
          </tr>
          <tr>
            <th>Pts</th>
            <th>Away</th>
            <th>Spread</th>
            <th>Home</th>
            <th>Pts</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {pending.map(game => (
            <tr>
              <td>
                <InputGroup className='mb-3'>
                  <Form.Control
                    placeholder='Away Pts'
                    id={`${game.id}-awayPts`}
                  />
                </InputGroup>
              </td>
              <td>
                <Image src={`/logos/${game.away}.png`} />
              </td>
              <td>{game.spread}</td>
              <td>
                <Image src={`/logos/${game.home}.png`} />
              </td>
              <td>
                <InputGroup className='mb-3'>
                  <Form.Control
                    placeholder='Home Pts'
                    id={`${game.id}-homePts`}
                  />
                </InputGroup>
              </td>
              <td>
                <Button
                  type='button'
                  onClick={this.handleClick}
                  value={`${game.id}`}
                >
                  Submit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
}

const mapState = state => ({
  user: state.user,
  games: state.games,
});

const mapDispatch = dispatch => ({
  completeGame: game => dispatch(completeSingleGame(game)),
});

export default connect(mapState, mapDispatch)(UpdateScores);
