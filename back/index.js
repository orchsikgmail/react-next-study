const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const passport = require('passport');
const dotenv = require('dotenv');

const passportConfig = require('./passport');
const db = require('./models');

const userAPIRouter = require('./routes/user');
const postsAPIRouter = require('./routes/posts');
const postAPIRouter = require('./routes/post');
const hashtagAPIRouter = require('./routes/hashtag');

dotenv.config();
db.sequelize.sync();
passportConfig();
const app = express();

app.use(morgan('dev'));
app.use(
  cors({
    // 쿠키 서로 교환하려면 필요.
    origin: true, // 'http://localhost:3060'
    credentials: true,
  }),
);
app.use(express.json()); // JSON 데이터 처리
app.use(express.urlencoded({ extended: true })); // form 으로 넘기는 데이터 처리
app.use('/api', express.static('uploads'));

app.use(cookieParser(process.env.COOKIE_SECRET)); // 쿠기 암호화
app.use(
  expressSession({
    resave: false, // 매번 세션 강제 저장
    saveUninitialized: false, // 빈 값도 저장
    secret: process.env.COOKIE_SECRET, // 쿠기 암호화
    cookie: {
      httpOnly: true, // javascript에서 쿠키에 접근 막음
      secure: false, // https를 사용할때 true
    },
    name: 'illililililiililili',
  }),
);
// 로그인 인증을 편하게 해줌
app.use(passport.initialize()); // 세션 미들웨어 뒤에서 use
app.use(passport.session());

// API: 다른 서비스가 내 서비스의 기능을 실행할 수 있게 열어둔 창구
app.use('/api/user', userAPIRouter);
app.use('/api/posts', postsAPIRouter);
app.use('/api/post', postAPIRouter);
app.use('/api/hashtag', hashtagAPIRouter);

app.listen(3065, () => {
  console.log('server is running on http://127.0.0.1:3065');
});
