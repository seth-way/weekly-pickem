const fs = require('fs');
const { parse } = require('csv-parse');
const { db, Game, Pick, User, Result } = require('../server/db');

const gameDates = {
  1: new Date(2022, 8, 12),
  2: new Date(2022, 8, 19),
  3: new Date(2022, 8, 26),
  4: new Date(2022, 9, 3),
  5: new Date(2022, 9, 10),
  6: new Date(2022, 9, 17),
  7: new Date(2022, 9, 24),
};

const results = [
  { week: 1, winners: [4], losers: [1, 2, 3, 5, 6] },
  { week: 2, winners: [4], losers: [1, 2, 3, 5, 6] },
  { week: 3, winners: [4], losers: [1, 2, 3, 5, 6] },
  { week: 4, winners: [6], losers: [1, 2, 3, 5, 4] },
  { week: 5, winners: [6], losers: [1, 3, 5, 4] },
  { week: 6, winners: [1], losers: [3, 4, 5, 6] },
];

const seed = async () => {
  await db.sync();

  await Promise.all(results.map(async result => Result.create(result)));

  // Create Players object where key is player name and
  // value is player object
  const createUsers = async () => {
    const users = { T: null, K: null, E: null, S: null, B: null, A: null };
    for (const name in users) {
      const admin = name === 'S' ? true : false;
      users[name] = await User.create({ name, admin });
    }
    return users;
  };

  const users = await createUsers();

  // 1 week at a time
  for (let i = 1; i < 8; i += 1) {
    const gamesCSV = fs
      .readFileSync(`./bin/games/week${i}.csv`)
      .toString()
      .split('\n');

    // Create an array of this weeks game objects
    const games = await Promise.all(
      gamesCSV.map(async row => {
        let [awayPts, away, spread, home, homePts] = row.split(',');
        if (!home) return null;
        // filter csv data
        awayPts = parseInt(awayPts);
        away = away.replace(/[^A-Z]/g, '');
        spread = parseFloat(spread);
        home = home.replace(/[^A-Z]/g, '');
        homePts = parseInt(homePts.replace(/[^0-9]/g, ''));

        let winner = null;
        if (awayPts + spread > homePts) winner = away;
        if (awayPts + spread < homePts) winner = home;

        const week = i;
        const start = gameDates[i];

        return await Game.create({
          awayPts,
          away,
          spread,
          home,
          homePts,
          winner,
          week,
          start,
        });
      })
    );

    const picksCSV = fs
      .readFileSync(`./bin/picks/week${i}.csv`)
      .toString()
      .split('\n');

    if (picksCSV[picksCSV.length - 1] === '') picksCSV.pop();

    const thisWeeksPlayers = picksCSV[0]
      .split(',')
      .map(player => player.replace(/[^A-Z]/g, ''));

    const tieBreakers = picksCSV[picksCSV.length - 1]
      .split(',')
      .map(score => score.replace(/[^0-9]/g, '-'));

    for (let i = 1; i < picksCSV.length - 1; i += 1) {
      const gameIdx = i - 1;
      const picks = picksCSV[i]
        .split(',')
        .map(pick => pick.replace(/[^A-Z]/g, ''));

      for (const [idx, choice] of picks.entries()) {
        const gameId = games[gameIdx].id;
        const userId = users[thisWeeksPlayers[idx]].id;
        const success = choice === games[gameIdx].winner ? 'win' : 'loss';

        let tiebreaker = false;
        let homePts = null;
        let awayPts = null;

        if (i === picksCSV.length - 2) {
          tiebreaker = true;
          awayPts = parseInt(tieBreakers[idx].split('-')[0]);
          homePts = parseInt(tieBreakers[idx].split('-')[1]);
        }

        await Pick.create({
          choice,
          gameId,
          userId,
          success,
          tiebreaker,
          homePts,
          awayPts,
        });
      }
    }
  }

  db.close();
  console.log('Seeding Successful!');
};

try {
  seed();
} catch (err) {
  db.close();
  console.log(`
    Error seeding:
    ${err.message}
    ${err.stack}
  `);
}
