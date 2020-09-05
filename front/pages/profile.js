import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWINGS_REQUEST, REMOVE_FOLLOWER_REQUEST, UNFOLLOW_USER_REQUEST } from '../reducers/user';
import { LOAD_USER_POSTS_REQUEST } from '../reducers/post';

import NickNameEditForm from '../containers/NickNameEditForm';
import PostCard from '../containers/PostCard';
import FollowList from '../components/FollowList';

const Profile = () => {
  const dispatch = useDispatch();
  const { me, followingList, followerList, hasMoreFollower, hasMoreFollowing } = useSelector((state) => state.user);
  const { mainPosts } = useSelector((state) => state.post);

  const onUnfollow = useCallback(
    (userId) => () => {
      dispatch({
        type: UNFOLLOW_USER_REQUEST,
        data: userId,
      });
    },
    [],
  );

  const onRemoveFollower = useCallback(
    (userId) => () => {
      dispatch({
        type: REMOVE_FOLLOWER_REQUEST,
        data: userId,
      });
    },
    [],
  );

  const loadMoreFollowings = useCallback(() => {
    dispatch({
      type: LOAD_FOLLOWINGS_REQUEST,
      offset: followingList.length,
    });
  }, [followingList.length]);

  const loadMoreFollowers = useCallback(() => {
    dispatch({
      type: LOAD_FOLLOWERS_REQUEST,
      offset: followerList.length,
    });
  }, [followerList.length]);

  return (
    <>
      <NickNameEditForm />
      <FollowList header="팔로잉 목록" hasMore={hasMoreFollowing} onClickMore={loadMoreFollowings} data={followingList} onClickStop={onUnfollow} />
      <FollowList header="팔로워 목록" hasMore={hasMoreFollower} onClickMore={loadMoreFollowers} data={followerList} onClickStop={onRemoveFollower} />
      <div>
        {mainPosts.map((post) => (
          <PostCard key={post.createdAt} post={post} />
        ))}
      </div>
    </>
  );
};

Profile.getInitialProps = async (context) => {
  const { dispatch, getState } = context.store;
  const state = getState();

  // 이 직전에 LOAD_USERS_REQUEST
  dispatch({
    type: LOAD_FOLLOWERS_REQUEST,
    data: state.user.me && state.user.me.id,
  });
  dispatch({
    type: LOAD_FOLLOWINGS_REQUEST,
    data: state.user.me && state.user.me.id,
  });
  dispatch({
    type: LOAD_USER_POSTS_REQUEST,
    data: state.user.me && state.user.me.id,
  });

  // 이 쯤에서 LOAD_USERS_SUCCESS 돼서 me가 생김.
};

export default Profile;
