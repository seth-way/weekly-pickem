import React from 'react';
import { connect } from 'react-redux';
import SuccessRateBarChart from './SuccessRateBarChart';
import WinLossLineChart from './WinLossLineChart';

const users = { 1: 'T', 2: 'K', 3: 'E', 4: 'S', 5: 'B', 6: 'A' };

const normalizePicks = history =>
  Object.entries(history).map(([id, { correct, incorrect }]) => ({
    name: users[id],
    successRate: correct / (incorrect + correct),
  }));

const normalizeResults = results => {
  const data = [];

  const userCash = { ...users };
  Object.keys(userCash).forEach(key => {
    userCash[key] = 0;
  });

  Object.values(results).forEach(result => {
    const currentStanding = { name: `Week ${result.week}` };
    const moneyPerWinner = (2 * result.losers.length) / result.winners.length;
    result.winners.forEach(winner => {
      userCash[winner] += moneyPerWinner;
    });
    result.losers.forEach(loser => {
      userCash[loser] -= 2;
    });
    Object.entries(userCash).forEach(([id, currentCash]) => {
      currentStanding[users[id]] = currentCash;
    });
    data.push(currentStanding);
  });

  return data;
};

const AllResults = props => {
  const { picks, results } = props;

  if (!Object.values(results).length || !picks.length)
    return <div>loading....</div>;

  console.log('FROM ALL RESULTS........');
  console.log('PICKS........ ', picks.slice(0, 10));
  console.log('RESULTS........', results);

  const userPickHistory = {};

  Object.keys(users).forEach(user => {
    userPickHistory[user] = { correct: 0, incorrect: 0 };
  });

  picks.forEach(pick => {
    if (pick.success === 'loss') userPickHistory[pick.userId].incorrect += 1;
    if (pick.success === 'win') userPickHistory[pick.userId].correct += 1;
  });

  return (
    <div className='column'>
      <h2>Pick Success Rate</h2>
      <SuccessRateBarChart data={normalizePicks(userPickHistory)} />
      <br />
      <h2>Current Cash Standings</h2>
      <WinLossLineChart data={normalizeResults(results)} />
    </div>
  );
};

const mapState = state => ({
  picks: state.picks,
  results: state.results,
});

export default connect(mapState)(AllResults);
