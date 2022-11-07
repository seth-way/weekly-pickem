import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { connect } from 'react-redux';
import { fetchUser } from '../store/reducers/user';
import { fetchGames } from '../store/reducers/games';
import { fetchWeek } from '../store/reducers/week';

const users = {
  T: 1,
  K: 2,
  E: 3,
  S: 4,
  B: 5,
  A: 6,
};

const weeks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

class AppNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: props.user };
    this.handleUserSelect = this.handleUserSelect.bind(this);
    this.handleWeekSelect = this.handleWeekSelect.bind(this);
  }

  handleWeekSelect(week) {
    this.props.fetchSingleWeek(week);
  }

  handleUserSelect(id) {
    const { updateUser } = this.props;
    updateUser(id);
  }

  componentDidUpdate(prev) {
    if (prev.user?.id !== this.props.user?.id) {
      this.setState({ user: this.props.user });
    }
  }

  render() {
    const { user } = this.state;
    const { latestWeek, loadGames } = this.props;

    const loginMessage = () => (
      <Navbar.Collapse className='justify-content-end'>
        <Navbar.Text>
          {user.name ? `Good Luck, ${user.name}!` : 'Sign In...'}
        </Navbar.Text>
      </Navbar.Collapse>
    );

    return (
      <Navbar bg='dark' variant='dark'>
        <Container>
          <Navbar.Brand href='/'>Pick-Em</Navbar.Brand>
          <Nav className='me-auto'>
            <DropdownButton
              as={ButtonGroup}
              title='Results'
              size='sm'
              variant='info'
              handleSelect={this.handleWeekSelect}
            >
              {weeks.map(week => (
                <Dropdown.Item
                  href={`#/games/${week}`}
                  eventKey={week}
                  onClick={() => this.handleWeekSelect(week)}
                >{`Week ${week}`}</Dropdown.Item>
              ))}
            </DropdownButton>
            {/* RENDER ADMIN OPTIONS ONLY IF USER IS AN ADMIN */}
            {user.admin ? (
              <>
                <DropdownButton
                  as={ButtonGroup}
                  title='Admin'
                  size='sm'
                  variant='success'
                >
                  <Dropdown.Item href='#/admin/addGames'>
                    Add Games
                  </Dropdown.Item>
                  <Dropdown.Item href='#/admin/updateScores'>
                    Update Scores
                  </Dropdown.Item>
                  <Dropdown.Item href='#/admin/addResults'>
                    Add Results
                  </Dropdown.Item>
                </DropdownButton>
              </>
            ) : (
              ''
            )}
            {/* RENDER USER PICK OPTIONS ONLY IF USER HAS BEEN SELECTED */}
            {user.id ? (
              <>
                <Nav.Link href='#/makePicks' onClick={() => loadGames()}>
                  Make Picks
                </Nav.Link>
              </>
            ) : (
              ''
            )}
          </Nav>
          {loginMessage()}
          <DropdownButton
            as={ButtonGroup}
            variant={user && user.id ? 'primary' : 'danger'}
            title='User'
            onSelect={this.handleUserSelect}
            align='end'
          >
            {Object.entries(users).map(([username, id]) => (
              <Dropdown.Item eventKey={id}>{username}</Dropdown.Item>
            ))}
            <Dropdown.Item eventKey={null}>Sign Out</Dropdown.Item>
          </DropdownButton>
        </Container>
      </Navbar>
    );
  }
}

const mapState = state => ({
  user: state.user,
});

const mapDispatch = dispatch => ({
  updateUser: id => dispatch(fetchUser(id)),
  loadGames: () => dispatch(fetchGames()),
  fetchSingleWeek: week => dispatch(fetchWeek(week)),
});

export default connect(mapState, mapDispatch)(AppNavbar);
