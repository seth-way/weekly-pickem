const fs = require('fs');
const { parse } = require('csv-parse');
const { db, Game, Pick, Player } = require('../server/db');

const gameDates = {
  1: new Date(2022, 8, 12),
  2: new Date(2022, 8, 19),
  3: new Date(2022, 8, 26),
  4: new Date(2022, 9, 3),
  5: new Date(2022, 9, 10),
  6: new Date(2022, 9, 17),
  7: new Date(2022, 9, 24),
};

const seed = async () => {
  await db.sync({ force: true });

  const test = fs.readFileSync('./bin/games/week1.csv').toString().split('\n');
  const test2 = fs.readFileSync('./bin/picks/week1.csv').toString().split('\n');
  console.log(test);

  for (let i = 1; i < 8; i += 1) {
    const gamesCSV = fs
      .readFileSync(`./bin/games/week${i}.csv`)
      .toString()
      .split('\n');

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
