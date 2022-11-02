import React from 'react';
import { connect } from 'react-redux';

class AllGamesByWeek extends React.Component {
  render() {
    return <div>ROUTE IS WORKING!!!!</div>;
  }
}

const mapState = state => ({
  games
})

export default connect(mapState)(AllGamesByWeek);
