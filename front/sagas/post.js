import { all, delay, takeLatest, put, call, fork, throttle } from 'redux-saga/effects';
import axios from 'axios';
import {
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  ADD_POST_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  ADD_COMMENT_FAILURE,
  LOAD_MAIN_POSTS_REQUEST,
  LOAD_MAIN_POSTS_SUCCESS,
  LOAD_MAIN_POSTS_FAILURE,
  LOAD_USER_POSTS_REQUEST,
  LOAD_USER_POSTS_SUCCESS,
  LOAD_USER_POSTS_FAILURE,
  LOAD_HASHTAG_POSTS_REQUEST,
  LOAD_HASHTAG_POSTS_SUCCESS,
  LOAD_HASHTAG_POSTS_FAILURE,
  LOAD_COMMENTS_REQUEST,
  LOAD_COMMENTS_SUCCESS,
  LOAD_COMMENTS_FAILURE,
  UPLOAD_IMAGES_REQUEST,
  UPLOAD_IMAGES_FAILURE,
  UPLOAD_IMAGES_SUCCESS,
  LIKE_POST_REQUEST,
  UNLIKE_POST_REQUEST,
  LIKE_POST_SUCCESS,
  LIKE_POST_FAILURE,
  UNLIKE_POST_SUCCESS,
  UNLIKE_POST_FAILURE,
  RETWEET_REQUEST,
  RETWEET_SUCCESS,
  RETWEET_FAILURE,
  REMOVE_POST_REQUEST,
  REMOVE_POST_SUCCESS,
  REMOVE_POST_FAILURE,
  LOAD_POST_REQUEST,
  LOAD_POST_SUCCESS,
  LOAD_POST_FAILURE,
} from '../reducers/post';

import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from '../reducers/user';

/**
 * ADD_POST_REQUEST
 */
function postAPI(postData) {
  return axios.post('/post', postData, { withCredentials: true });
}

function* addPost(action) {
  try {
    const result = yield call(postAPI, action.data);
    yield put({
      type: ADD_POST_SUCCESS,
      data: result.data,
    });
    yield put({
      type: ADD_POST_TO_ME,
      data: result.data.id,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: ADD_POST_FAILURE,
      error: error.message,
    });
  }
}

function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}

/**
 * LOAD_USER_POSTS_REQUEST
 */
function loadUserPostsAPI(userId) {
  return axios.get(`/user/${userId || 0}/posts`);
}

function* loadUserPosts(action) {
  try {
    const result = yield call(loadUserPostsAPI, action.data);
    yield put({
      type: LOAD_USER_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: LOAD_USER_POSTS_FAILURE,
      error: error.message,
    });
  }
}

function* watchloadUserPosts() {
  yield takeLatest(LOAD_USER_POSTS_REQUEST, loadUserPosts);
}

/**
 * LOAD_HASHTAG_POSTS_REQUEST
 */
function loadHashtagPostsAPI(lastId = 0, tag, limit = 10) {
  return axios.get(`/hashtag/${encodeURIComponent(tag)}/?lastId=${lastId}&limit=${limit}`);
}

function* loadHashtagPosts(action) {
  try {
    const result = yield call(loadHashtagPostsAPI, action.lastId, action.data);
    yield put({
      type: LOAD_HASHTAG_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: LOAD_HASHTAG_POSTS_FAILURE,
      error: error.message,
    });
  }
}

function* watchLoadHashtagPosts() {
  yield throttle(500, LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts);
}

/**
 * LOAD_MAIN_POSTS_REQUEST
 */
function loadMainPostsAPI(lastId = 0, limit = 10) {
  return axios.get(`/posts?lastId=${lastId}&limit=${limit}`);
}

function* loadMainPosts(action) {
  try {
    const result = yield call(loadMainPostsAPI, action.lastId);
    yield put({
      type: LOAD_MAIN_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: LOAD_MAIN_POSTS_FAILURE,
      error: error.message,
    });
  }
}

function* watchLoadMainPosts() {
  yield throttle(500, LOAD_MAIN_POSTS_REQUEST, loadMainPosts);
}

/**
 * ADD_COMMENT_REQUEST
 */
function addCommentAPI(data) {
  return axios.post(`post/${data.postId}/comment`, { content: data.content }, { withCredentials: true });
}

function* addComment(action) {
  try {
    const result = yield call(addCommentAPI, action.data);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: {
        postId: action.data.postId,
        comment: result.data,
      },
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: ADD_COMMENT_FAILURE,
      error: error.message,
    });
  }
}

function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

/**
 * LOAD_COMMENTS_REQUEST
 */
function loadCommentsAPI(postId) {
  return axios.get(`post/${postId}/comments`);
}

function* loadComments(action) {
  try {
    const result = yield call(loadCommentsAPI, action.data);
    yield put({
      type: LOAD_COMMENTS_SUCCESS,
      data: {
        postId: action.data,
        comments: result.data,
      },
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: LOAD_COMMENTS_FAILURE,
      error: error.message,
    });
  }
}

function* watchLoadComments() {
  yield takeLatest(LOAD_COMMENTS_REQUEST, loadComments);
}

/**
 * UPLOAD_IMAGES_REQUEST
 */
const uploadImagesAPI = (formData) => {
  return axios.post('/post/images', formData, {
    withCredentials: true,
  });
};

function* uploadImages(action) {
  try {
    const result = yield call(uploadImagesAPI, action.data);
    yield put({
      type: UPLOAD_IMAGES_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: UPLOAD_IMAGES_FAILURE,
      error,
    });
  }
}

function* watchUploadImages() {
  yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}

/**
 * LIKE_POST_REQUEST
 */
const likePostAPI = (postId) => {
  return axios.post(
    `/post/${postId}/like`,
    {},
    {
      withCredentials: true,
    },
  );
};

function* likePost(action) {
  try {
    const result = yield call(likePostAPI, action.data);
    yield put({
      type: LIKE_POST_SUCCESS,
      data: {
        postId: action.data,
        userId: result.data.userId,
      },
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: LIKE_POST_FAILURE,
      error,
    });
  }
}

function* watchLikePost() {
  yield takeLatest(LIKE_POST_REQUEST, likePost);
}

/**
 * UNLIKE_POST_REQUEST
 */
const unlikePostAPI = (postId) => {
  return axios.delete(`/post/${postId}/like`, {
    withCredentials: true,
  });
};

function* unlikePost(action) {
  try {
    const result = yield call(unlikePostAPI, action.data);
    yield put({
      type: UNLIKE_POST_SUCCESS,
      data: {
        postId: action.data,
        userId: result.data.userId,
      },
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: UNLIKE_POST_FAILURE,
      error,
    });
  }
}

function* watchUnlikePost() {
  yield takeLatest(UNLIKE_POST_REQUEST, unlikePost);
}

/**
 * RETWEET_REQUEST
 */
const retweetAPI = (postId) => {
  return axios.post(
    `/post/${postId}/retweet`,
    {},
    {
      withCredentials: true,
    },
  );
};

function* retweet(action) {
  try {
    const result = yield call(retweetAPI, action.data);
    yield put({
      type: RETWEET_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: RETWEET_FAILURE,
      error,
    });
    alert(error.response && error.response.data);
  }
}

function* watchRetweet() {
  yield takeLatest(RETWEET_REQUEST, retweet);
}

/**
 * REMOVE_POST_REQUEST
 */
const removePostAPI = (postId) => {
  return axios.delete(`/post/${postId}`, { withCredentials: true });
};

function* removePost(action) {
  try {
    const result = yield call(removePostAPI, action.data);

    yield put({
      type: REMOVE_POST_SUCCESS,
      data: result.data,
    });

    yield put({
      type: REMOVE_POST_OF_ME,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: REMOVE_POST_FAILURE,
      error,
    });
  }
}

function* watchRemovePost() {
  yield takeLatest(REMOVE_POST_REQUEST, removePost);
}

/**
 * LOAD_POST_REQUEST
 */
const loadPostAPI = (postId) => {
  return axios.get(`/post/${postId}`);
};

function* loadPost(action) {
  try {
    const result = yield call(loadPostAPI, action.data);
    yield put({
      type: LOAD_POST_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: LOAD_POST_FAILURE,
      error,
    });
  }
}

function* watchLoadPost() {
  yield takeLatest(LOAD_POST_REQUEST, loadPost);
}

export default function* postSaga() {
  yield all([
    fork(watchAddPost),
    fork(watchLoadMainPosts),
    fork(watchAddComment),
    fork(watchloadUserPosts),
    fork(watchLoadHashtagPosts),
    fork(watchLoadComments),
    fork(watchUploadImages),
    fork(watchLikePost),
    fork(watchUnlikePost),
    fork(watchRetweet),
    fork(watchRemovePost),
    fork(watchLoadPost),
  ]);
}
