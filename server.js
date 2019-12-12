const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  // console.log('unhandledRejection, server shutting down');
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE_LOCAL;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('successful con.connections');
  });

// console.log(process.env);
const port = process.env.PORT || 3000;

// eslint-disable-next-line no-console
const server = app.listen(port, () =>
  console.log(`server run in port: ${port}`)
);

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  // console.log('unhandledRejection, server shutting down');
  server.close(() => {
    process.exit(1);
  });
});
