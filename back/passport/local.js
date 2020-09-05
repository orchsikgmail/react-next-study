const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');

const db = require('../models');

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'userId', // req.body.userId
        passwordField: 'password', // req.body.password
      },
      async (userId, password, done) => {
        try {
          const result = await db.User.findOne({ where: { userId } });
          // done(서버 요청이 에러난 경우, 서버 요청이 성공한 경우, 로직상 에러인 경우)
          if (!result) return done(null, false, { reason: '존재하지 않는 사용자입니다.' });
          const user = result.dataValues;

          const passwordCheck = await bcrypt.compare(password, user.password);
          if (!passwordCheck) return done(null, false, { reason: '비밀번호가 틀립니다.' });

          return done(null, user);
        } catch (e) {
          console.error(e);
          return done(e);
        }
      },
    ),
  );
};
