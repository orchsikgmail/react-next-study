const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  development: {
    username: 'sa',
    password: process.env.DB_PASSWORD,
    database: 'reactnext',
    host: '127.0.0.1',
    dialect: 'mssql',
    dialectOptions: {
      options: {
        useUTC: false,
        dateFirst: 1,
      },
    },
    operatorsAliases: false,
  },
  test: {
    username: 'sa',
    password: process.env.DB_PASSWORD,
    database: 'reactnext',
    host: '127.0.0.1',
    dialect: 'mssql',
    dialectOptions: {
      options: {
        useUTC: false,
        dateFirst: 1,
      },
    },
    operatorsAliases: false,
  },
  production: {
    username: 'sa',
    password: process.env.DB_PASSWORD,
    database: 'reactnext',
    host: '127.0.0.1',
    dialect: 'mssql',
    dialectOptions: {
      options: {
        useUTC: false,
        dateFirst: 1,
      },
    },
    operatorsAliases: false,
  },
};
