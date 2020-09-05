'use strict';
const sql = require('mssql');
const config = require('./config/config.json');
const env = process.env.NODE_ENV || 'development';

const pool = null;
const db = () => {
  if (!pool) pool = new sql.ConnectionPool(config[env].dbConn).connect();
  return pool;
};

module.exports = db;

// 시쿼라이저 안쓰고 디비 바로 쓸때
