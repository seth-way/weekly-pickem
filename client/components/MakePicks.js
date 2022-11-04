import React, { Component } from 'react';
import { connect } from 'react-redux';

class MakePicks extends Component {
  render() {
    return <div>MakePicks</div>;
  }
}

const mapState = state => ({
  games: state.games,
});

export default connect(mapState)(MakePicks);
