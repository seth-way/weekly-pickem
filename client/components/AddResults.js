import React, { Component } from 'react';
import { connect } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';

const weeks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const players = { 1: 'T', 2: 'K', 3: 'E', 4: 'S', 5: 'B', 6: 'A' };

class AddResults extends Component {
  constructor(props) {
    super(props);
    this.state = { week: null, winners: [], losers: [] };

    this.handleWeekChange = this.handleWeekChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleWeekChange(e) {
    const week = e.target.value;
    this.setState({ week });
  }

  handleChange(val, e) {
    const property = e.target.parentElement.id;
    this.setState({ [property]: val });
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  render() {
    const { winners, losers } = this.state;
    return (
      <Form className='form' onSubmit={this.handleSubmit}>
        <Row className='align-items-center'>Create New Result</Row>
        <Row className='align-items-center'>
          <Form.Control as='select' onChange={this.handleWeekChange}>
            <option value='null'>Select A Week</option>
            {weeks.map(week => (
              <option value={week}>{`Week ${week}`}</option>
            ))}
          </Form.Control>
        </Row>
        <Row className='align-items-center'>Winners</Row>
        <Row className='align-items-center'>
          <ToggleButtonGroup
            type='checkbox'
            value={winners}
            id='winners'
            onChange={this.handleChange}
          >
            {Object.entries(players).map(([id, name]) => (
              <ToggleButton id={`winner-${id}`} value={+id}>
                {name}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Row>
        <Row className='align-items-center'>Losers</Row>
        <Row className='align-items-center'>
          <ToggleButtonGroup
            type='checkbox'
            value={losers}
            id='losers'
            onChange={this.handleChange}
          >
            {Object.entries(players).map(([id, name]) => (
              <ToggleButton id={`loser-${id}`} value={+id}>
                {name}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Row>
        <Row className='align-items-center'>
          <Button type='submit' variant='info'>
            Submit
          </Button>
        </Row>
      </Form>
    );
  }
}

export default connect(null)(AddResults);
