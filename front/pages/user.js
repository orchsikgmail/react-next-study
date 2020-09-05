import React, { useEffect } from 'react';
import T from 'prop-types';
import { Card, Avatar } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { LOAD_USER_REQUEST } from '../reducers/user';
import { LOAD_USER_POSTS_REQUEST } from '../reducers/post';
import PostCard from '../containers/PostCard';

const User = ({ id }) => {
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch({ type: LOAD_USER_REQUEST, data: id });
  //   dispatch({ type: LOAD_USER_POSTS_REQUEST, data: id });
  // }, []);

  const { userInfo } = useSelector((state) => state.user);
  const { mainPosts } = useSelector((state) => state.post);
  return (
    <div>
      {userInfo ? (
        <Card
          actions={[
            <div key="post">
              포스트
              <br />
              {userInfo.Posts}
            </div>,
            <div key="following">
              팔로잉
              <br />
              {userInfo.Follwings}
            </div>,
            <div key="follower">
              팔로워
              <br />
              {userInfo.Followers}
            </div>,
          ]}
        >
          <Card.Meta avatar={<Avatar>{userInfo.nickname[0]}</Avatar>} title={userInfo.nickname} />
        </Card>
      ) : null}

      {mainPosts.map((post) => (
        <PostCard key={post.createdAt} post={post} />
      ))}
    </div>
  );
};

User.getInitialProps = async (ctx) => {
  const { dispatch } = ctx.store;
  const { id } = ctx.query;

  dispatch({
    type: LOAD_USER_REQUEST,
    data: id,
  });
  dispatch({
    type: LOAD_USER_POSTS_REQUEST,
    data: id,
  });

  // query로 받은 id를
  // _app.js로 전달하면
  // user.js의 props로 전달받을 수 있음
  return { id: parseInt(id, 10) };
};

User.propTypes = {
  id: T.number.isRequired,
};

export default User;
