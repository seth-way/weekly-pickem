const PORT = process.env.PORT || 8080;
const server = require('./index');
const { db } = require('./db');
const { eventNames } = require('./index');

db.sync().then(() => {
  server.listen(PORT, () =>
    console.log(`
        Listening on port ${PORT}
    `)
  );
});
