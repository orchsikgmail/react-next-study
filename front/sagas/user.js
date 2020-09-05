import axios from 'axios';
import { all, call, fork, takeEvery, takeLatest, put } from 'redux-saga/effects';

import {
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_FAILURE,
  SIGN_UP_SUCCESS,
  LOG_OUT_REQUEST,
  LOG_OUT_SUCCESS,
  LOG_OUT_FAILURE,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAILURE,
  FOLLOW_USER_REQUEST,
  FOLLOW_USER_SUCCESS,
  FOLLOW_USER_FAILURE,
  UNFOLLOW_USER_REQUEST,
  UNFOLLOW_USER_FAILURE,
  UNFOLLOW_USER_SUCCESS,
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWERS_SUCCESS,
  LOAD_FOLLOWERS_FAILURE,
  LOAD_FOLLOWINGS_REQUEST,
  LOAD_FOLLOWINGS_SUCCESS,
  LOAD_FOLLOWINGS_FAILURE,
  REMOVE_FOLLOWER_REQUEST,
  REMOVE_FOLLOWER_SUCCESS,
  REMOVE_FOLLOWER_FAILURE,
  EDIT_NICKNAME_REQUEST,
  EDIT_NICKNAME_FAILURE,
  EDIT_NICKNAME_SUCCESS,
} from '../reducers/user';

/**
 * LOGIN
 */
function loginAPI(loginData) {
  // cors에서 쿠키 서로 교환하려면 필요.
  // 클라이언트에서 요청 보낼 때는 브라우저가 쿠키를 같이 동봉해준다.
  // 서버사이드렌더링일 때는 브라우저가 없다. 개발자가 직접 넣어줘야 한다.
  return axios.post('/user/login', loginData, { withCredentials: true });
}

function* login(action) {
  try {
    const result = yield call(loginAPI, action.data);
    yield put({
      type: LOG_IN_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    yield put({
      type: LOG_IN_FAILURE,
      reason: '아이디 또는 비밀번호를 확인해주세요.',
    });
  }
}

function* watchLogIn() {
  yield takeLatest(LOG_IN_REQUEST, login);
}

// function* watchLogin_take() {
//   while (true) {
//     yield take(LOG_IN_REQUEST);
//     yield login();
//   }
// }

// function* watchLogin_takeEvery() {
//   yield takeEvery(LOG_IN_REQUEST, login);
// }

/**
 * SIGN_UP
 */
function singUpAPI(signUpData) {
  return axios.post('/user', signUpData);
}

function* singUp(action) {
  try {
    yield call(singUpAPI, action.data);
    yield put({
      type: SIGN_UP_SUCCESS,
    });
  } catch (error) {
    console.log(error);
    yield put({
      type: SIGN_UP_FAILURE,
      error: error.message,
    });
  }
}

function* watchSignUp() {
  yield takeEvery(SIGN_UP_REQUEST, singUp);
}

/**
 * LOG_OUT
 */
function logOutAPI() {
  return axios.post('/user/logout', {}, { withCredentials: true });
}

function* logOut() {
  try {
    yield call(logOutAPI);
    yield put({
      type: LOG_OUT_SUCCESS,
    });
  } catch (error) {
    console.log(error);
    yield put({
      type: LOG_OUT_FAILURE,
      error: error.message,
    });
  }
}

function* watchLogOut() {
  yield takeEvery(LOG_OUT_REQUEST, logOut);
}

/**
 * LOAD_USER
 */
function loadUserAPI(id) {
  return axios.get(id ? `/user/${id}` : '/user', { withCredentials: true });
}

function* loadUser(action) {
  try {
    const result = yield call(loadUserAPI, action.data);
    yield put({
      type: LOAD_USER_SUCCESS,
      data: result.data,
      me: !action.data, // userId가 없으면 내 정보 불러온다.
    });
  } catch (error) {
    console.log(error);
    yield put({
      type: LOAD_USER_FAILURE,
      error: error.message,
    });
  }
}

function* watchLoadUser() {
  yield takeEvery(LOAD_USER_REQUEST, loadUser);
}

/**
 * FOLLOW_USER_REQUEST
 */
const followAPI = (userId) => {
  return axios.post(`/user/${userId}/follow`, {}, { withCredentials: true });
};

function* follow(action) {
  try {
    const result = yield call(followAPI, action.data);
    yield put({
      type: FOLLOW_USER_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: FOLLOW_USER_FAILURE,
      error,
    });
  }
}

function* watchFollow() {
  yield takeLatest(FOLLOW_USER_REQUEST, follow);
}

/**
 * FOLLOW_USER_REQUEST
 */
const unfollowAPI = (userId) => {
  return axios.delete(`/user/${userId}/follow`, { withCredentials: true });
};

function* unfollow(action) {
  try {
    const result = yield call(unfollowAPI, action.data);
    yield put({
      type: UNFOLLOW_USER_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: UNFOLLOW_USER_FAILURE,
      errror,
    });
  }
}

function* watchUnfollow() {
  yield takeLatest(UNFOLLOW_USER_REQUEST, unfollow);
}

/**
 * LOAD_FOLLOWERS_REQUEST
 */
const loadFollowersAPI = (userId, offset = 0, limit = 3) => {
  return axios.get(`user/${userId || 0}/followers?offset=${offset}&limit=${limit}`, {
    withCredentials: true,
  });
};

function* loadFollowers(action) {
  try {
    const result = yield call(loadFollowersAPI, action.data, action.offset);
    yield put({
      type: LOAD_FOLLOWERS_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: LOAD_FOLLOWERS_FAILURE,
      error,
    });
  }
}

function* watchLoadFollowers() {
  yield takeLatest(LOAD_FOLLOWERS_REQUEST, loadFollowers);
}

/**
 * LOAD_FOLLOWINGS_REQUEST
 */
const loadFollowingsAPI = (userId, offset = 0, limit = 3) => {
  // console.log(33333, userId, offset, limit);
  return axios.get(`/user/${userId || 0}/followings?offset=${offset}&limit=${limit}`, { withCredentials: true });
};

function* loadFollowings(action) {
  try {
    const result = yield call(loadFollowingsAPI, action.data, action.offset);
    yield put({
      type: LOAD_FOLLOWINGS_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: LOAD_FOLLOWINGS_FAILURE,
      error,
    });
  }
}

function* watchLoadFollowings() {
  yield takeLatest(LOAD_FOLLOWINGS_REQUEST, loadFollowings);
}

/**
 * REMOVE_FOLLOWER_REQUEST
 */
const removeFollowerAPI = (userId) => {
  return axios.delete(`/user/${userId}/follower`, { withCredentials: true });
};

function* removeFollower(action) {
  try {
    const result = yield call(removeFollowerAPI, action.data);
    yield put({
      type: REMOVE_FOLLOWER_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: REMOVE_FOLLOWER_FAILURE,
      error,
    });
  }
}

function* watchRemoveFollower() {
  yield takeLatest(REMOVE_FOLLOWER_REQUEST, removeFollower);
}
/**
 * EDIT_NICKNAME_REQUEST
 */
const editNicknameAPI = (nickname) => {
  return axios.patch('/user/nickname', { nickname }, { withCredentials: true });
};

function* editNickname(action) {
  try {
    const result = yield call(editNicknameAPI, action.data);
    yield put({
      type: EDIT_NICKNAME_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: EDIT_NICKNAME_FAILURE,
      errror,
    });
  }
}

function* watchEditNickname() {
  yield takeLatest(EDIT_NICKNAME_REQUEST, editNickname);
}

export default function* userSaga() {
  yield all([
    fork(watchLogIn),
    fork(watchLogOut),
    fork(watchLoadUser),
    fork(watchSignUp),
    fork(watchFollow),
    fork(watchUnfollow),
    fork(watchLoadFollowers),
    fork(watchLoadFollowings),
    fork(watchRemoveFollower),
    fork(watchEditNickname),
  ]);
}

// STUDY
// 사가는 next를 알아서 해주는 제너레이터 (이펙트에 따라 알아서 해준다.)

// call:            함수 동기적 호출 (api호출하는 함수에 많이 사용)
// fork:            함수 비동기적 호출
// put:            액션 dispatch

// take:            액션이 dispatch 될 때 take함수 안의 제너레이터를 next 한다. (반복안시키면 한번하고 끝나)
// takeLatest:      액션이 dispatch 될 때 두번째인자인 함수 호출 (마지막 호출만 실행, 끝나지 않은 이전 요청은 취소)
// takeEvery:       액션이 dispatch 될 때 두번째인자인 함수 호출 (모든 호출 실행)
