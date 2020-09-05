import React from 'react';
import Head from 'next/head';
import { Container } from 'next/app';
import T from 'prop-types';
import axios from 'axios';
import { Helmet } from 'react-helmet';
// REDUX
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import withRedux from 'next-redux-wrapper';
import withReduxSaga from 'next-redux-saga';

import reducer from '../reducers';
import rootSaga from '../sagas';
import AppLayout from '../components/AppLayout';

import { LOAD_USER_REQUEST } from '../reducers/user';

const App = ({ Component, store, pageProps }) => {
  return (
    <Provider store={store}>
      <Helmet
        title="TwitterFaker"
        htmlAttributes={{ lang: 'ko' }}
        meta={[
          { charSet: 'UTF-8' },
          {
            name: 'viewport',
            content: 'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=yes,viewport-fit=cover',
          },
          {
            httpEquiv: 'X-UA-Compatible',
            content: 'IE=edge',
          },
          {
            name: 'description',
            content: '짱구의 TwitterFaker SNS',
          },
          {
            name: 'og:title',
            content: 'TwitterFaker',
          },
          {
            name: 'og:description',
            content: '짱구의 TwitterFaker SNS',
          },
          {
            property: 'og:type',
            content: 'website',
          },
          {
            property: 'og:images',
            content: 'http://localhost:3060/favicon.png',
          },
        ]}
        link={[
          {
            rel: 'shortcut icon',
            href: '/favicon.png',
          },
          {
            rel: 'stylesheet',
            href: 'https://cdnjs.cloudflare.com/ajax/libs/antd/4.1.4/antd.css',
          },
          {
            rel: 'stylesheet',
            href: 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css',
          },
          {
            rel: 'stylesheet',
            href: 'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css',
          },
        ]}
      />

      {/* <Head>
        <title>Twitter Faker</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/4.1.4/antd.css" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/antd/4.1.4/antd.js" />

        <link rel="stylesheet" type="text/css" charSet="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
      </Head> */}
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
    </Provider>
  );
};

const reduxActionLog_custom = (store) => (next) => (action) => {
  console.log(action);
  next(action);
};

const configureStore = (initialState, options) => {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [
    sagaMiddleware,
    // reduxActionLog_custom
  ];

  const enhancer =
    process.env.NODE_ENV === 'production'
      ? compose(applyMiddleware(...middlewares))
      : compose(
          applyMiddleware(...middlewares),
          !options.isServer && typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined' ? window.__REDUX_DEVTOOLS_EXTENSION__() : (f) => f,
        );

  const store = createStore(reducer, initialState, enhancer);
  store.sagaTask = sagaMiddleware.run(rootSaga);
  return store;
};

App.getInitialProps = async (context) => {
  // getInitialProps: componentDidmount, componentDidUpade와 같은 라이프사이클의 일종. next 제공
  // 가장 최초에 실행되는 라이프사이클. 프론트 전에 서버쪽의 데이터를 미리 불러와서 프론트에서 사용할 수 있다.
  const { ctx, Component } = context; // context: next에서 제공, Component: 렌더링 중인 컴포넌트
  // console.log('ctx(context) keys:', Object.keys(ctx));

  /**
   * 개별 컴포넌트 전에 공통으로 적용할 때
   */
  if (ctx.isServer) {
    const cookie = ctx.req.headers.cookie || '';
    // console.log('cookie:', cookie);
    axios.defaults.headers.Cookie = cookie;
  }

  const state = ctx.store.getState();
  if (!state.user.me) {
    ctx.store.dispatch({
      type: LOAD_USER_REQUEST,
    });
  }

  /**
   * 개별 컴포넌트 진입할 때 마다 실행
   */
  let pageProps = {};
  if (Component.getInitialProps) pageProps = await Component.getInitialProps(ctx);
  // console.log('pageProps:', pageProps);
  return { pageProps };
};

App.propTypes = {
  Component: T.elementType.isRequired,
  store: T.object.isRequired,
};

export default withRedux(configureStore)(withReduxSaga(App));
