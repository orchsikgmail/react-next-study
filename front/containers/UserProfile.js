import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Avatar, Button } from 'antd';
import Link from 'next/link';

import { LOG_OUT_REQUEST } from '../reducers/user';

const UserProfile = () => {
  const { me } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const onLogout = useCallback(() => {
    dispatch({
      type: LOG_OUT_REQUEST,
    });
  }, []);

  return (
    <Card
      actions={[
        <Link href="/profile" key="post">
          <a>
            <div>
              포스트
              <br />
              {me.Posts ? me.Posts.length : 0}
            </div>
          </a>
        </Link>,
        <Link href="/profile" key="post">
          <a>
            <div>
              팔로잉
              <br />
              {me.Followings ? me.Followings.length : 0}
            </div>
          </a>
        </Link>,
        <Link href="/profile" key="post">
          <a>
            <div>
              팔로워
              <br />
              {me.Followers ? me.Followers.length : 0}
            </div>
          </a>
        </Link>,
      ]}
    >
      <Card.Meta avatar={<Avatar>{me.nickname[0]}</Avatar>} title={me.nickname} />
      <Button htmlType="button" onClick={onLogout}>
        로그아웃
      </Button>
    </Card>
  );
};

export default UserProfile;
