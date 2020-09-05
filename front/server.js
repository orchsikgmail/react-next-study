const express = require('express');
const next = require('next');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const prod = process.env.NODE_ENV === 'production';

const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
dotenv.config();

nextApp.prepare().then(() => {
  const app = express();

  app.use(morgan('dev'));
  app.use('/', express.static(path.join(__dirname, 'public')));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.use(
    expressSession({
      resave: false, // 수정될때만저장
      saveUninitialized: false, // loginSession에 false 추천 / 새로만들었어도변경없으면 저장 X
      secret: process.env.COOKIE_SECRET,
      cookie: {
        httpOnly: true,
        secure: false,
      },
    }),
  );

  // App.getInitialProps에서 사용 가능. 여기 프론트 서버쪽이 딱 요청받을 때 시작점이니까
  app.get('/post/:id', (req, res) => {
    return nextApp.render(req, res, '/post', { id: req.params.id });
  });

  app.get('/hashtag/:tag', (req, res) => {
    return nextApp.render(
      req,
      res,
      '/hashtag', // hashtag: rendering 할 pages 폴더의 파일명
      { tag: req.params.tag }, // ctx.query.tag에 들어감
    );
  });

  app.get('/user/:id', (req, res) => {
    return nextApp.render(req, res, '/user', { id: req.params.id });
  });

  app.get('*', (req, res) => {
    return handle(req, res);
  });

  app.listen(prod ? process.env.PORT : 3060, () => {
    console.log(`next+express running on port ${prod ? process.env.PORT : 3060}`);
  });
});
