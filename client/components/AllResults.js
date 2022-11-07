import React from 'react';
import { connect } from 'react-redux';

const users = { 1: 'T', 2: 'K', 3: 'E', 4: 'S', 5: 'B', 6: 'A' };

const AllResults = props => {
  const { picks, results } = props;

  const userPickHistory = {};

  Object.keys(users).forEach(user => {
    userPickHistory[user] = { correct: 0, incorrect: 0 };
  });

  picks.forEach(pick => {
    if (pick.success === 'loss') userPickHistory[pick.userId].incorrect += 1;
    if (pick.success === 'win') userPickHistory[pick.userId].correct += 1;
  });

  if (!Object.values(results).length || !picks.length)
    return <div>loading....</div>;
  return (
    <div>
      ALL RESULTS
      {Object.values(results).map(result => (
        <div>{JSON.stringify(result)}</div>
      ))}
    </div>
  );
};

const mapState = state => ({
  picks: state.picks,
  results: state.results,
});

export default connect(mapState)(AllResults);
