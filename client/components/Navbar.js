import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { connect } from 'react-redux';
import { fetchUser } from '../store/reducers/user';

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
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(id) {
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
              title='Group Picks'
              size='sm'
              variant='info'
            >
              {weeks.map(week => (
                <Dropdown.Item
                  href={`#/games/${week}`}
                  eventKey={week}
                >{`Week ${week}`}</Dropdown.Item>
              ))}
            </DropdownButton>
            {/* RENDER USER PICK OPTIONS ONLY IF USER HAS BEEN SELECTED */}
            {user.id ? (
              <>
                <DropdownButton
                  as={ButtonGroup}
                  title='My Picks'
                  size='sm'
                  variant='warning'
                >
                  {weeks.map(week => (
                    <Dropdown.Item
                      href={`#/picks/${week}/users/${user.id}`}
                      eventKey={week}
                    >{`Week ${week}`}</Dropdown.Item>
                  ))}
                </DropdownButton>
                <Nav.Link>Make Picks</Nav.Link>
              </>
            ) : (
              <div />
            )}
          </Nav>
          {loginMessage()}
          <DropdownButton
            as={ButtonGroup}
            variant={user && user.id ? 'primary' : 'danger'}
            title='User'
            onSelect={this.handleSelect}
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
});

export default connect(mapState, mapDispatch)(AppNavbar);
