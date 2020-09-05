const passport = require('passport');

const db = require('../models');
const local = require('./local');

module.exports = () => {
  // 로그인할 때 서버 세션에 [{ id: 3, cookie: 'abcdef' }] 이런 구조로 저장
  // 쿠키를 프론트로 보내주고, 프론트의 쿠키를 받으면 연결된 id 를 가지고 DB에서 해당 정보를 가져온다.
  // 사용자정보를 세션에 저장하면 세션 메모리 터져 세션엔 아이디 쿠키만 저장
  passport.serializeUser((user, done) => {
    return done(null, user.id);
  });

  // 위에 id로 어떤 정보를 가져올지 설정
  passport.deserializeUser(async (id, done) => {
    try {
      const result = await db.User.findOne({
        where: { id },
      });
      const user = result.dataValues;
      return done(null, user); // req.user에 저장한다.
    } catch (e) {
      console.error(e);
      return done(e);
    }
  });

  local();
};
/**
 * 프론트에서 서버로 cookie만 보낸다.
 * 서버가 쿠키파서, 익스프레스 세션으로 쿠키 검사 후 id: 3 발견
 * id: 3이 deserializeUser에 들어감
 * req.user로 사용자 정보가 들어감
 *
 * 요청 보낼 때 마다 deserializeUser가 실행됨
 * 매 요청마다 디비 요청이 1번씩 실행되므로
 * 실무에서는 deserializeUser 결과를 캐싱
 */
