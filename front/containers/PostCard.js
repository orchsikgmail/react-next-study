import React, { useState, useCallback, useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import T from 'prop-types';
import { Card, Avatar, Button, List, Comment, Popover } from 'antd';
import { HeartOutlined, HeartTwoTone, RetweetOutlined, MessageOutlined, EllipsisOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import moment from 'moment';

import { ADD_COMMENT_REQUEST, LOAD_COMMENTS_REQUEST, UNLIKE_POST_REQUEST, LIKE_POST_REQUEST, RETWEET_REQUEST, REMOVE_POST_REQUEST } from '../reducers/post';
import { FOLLOW_USER_REQUEST, UNFOLLOW_USER_REQUEST } from '../reducers/user';

import PostImages from '../components/PostImages';
import PostCardContent from '../components/PostCardContent';
import CommentForm from './CommentForm';
import FollowButton from '../components/FollowButton';

moment.locale('ko');

const CardWrapper = styled.div`
  margin-bottom: 20px;
`;

const PostCard = memo(({ post }) => {
  const dispatch = useDispatch();
  const id = useSelector((state) => state.user.me && state.user.me.id);

  const [commentFormOpened, setCommentFormOpened] = useState(false);

  const onToggleComment = useCallback(() => {
    setCommentFormOpened((prev) => !prev);
    if (!commentFormOpened) {
      dispatch({
        type: LOAD_COMMENTS_REQUEST,
        data: post.id,
      });
    }
  }, []);

  const liked = id && post.Likers && post.Likers.find((v) => v.id === id);

  const onToggleLike = useCallback(() => {
    if (!id) return alert('로그인이 필요합니다.');

    if (liked) {
      dispatch({
        type: UNLIKE_POST_REQUEST,
        data: post.id,
      });
    } else {
      dispatch({
        type: LIKE_POST_REQUEST,
        data: post.id,
      });
    }
  }, [id, post && post.id && liked]);

  const onRetweet = useCallback(() => {
    if (!id) return alert('로그인이 필요합니다.');
    dispatch({
      type: RETWEET_REQUEST,
      data: post.id,
    });
  }, [id && post && post.id]);

  const onUnfollow = useCallback(
    (userId) => () => {
      dispatch({
        type: UNFOLLOW_USER_REQUEST,
        data: userId,
      });
    },
    [],
  );

  const onFollow = useCallback(
    (userId) => () => {
      dispatch({
        type: FOLLOW_USER_REQUEST,
        data: userId,
      });
    },
    [],
  );

  const onRemovePost = useCallback(
    (postId) => () => {
      dispatch({
        type: REMOVE_POST_REQUEST,
        data: postId,
      });
    },
    [],
  );

  return (
    <CardWrapper>
      <Card
        key={post.createdAt + new Date()}
        cover={post.Images && post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <RetweetOutlined onClick={onRetweet} />,
          liked ? <HeartTwoTone twoToneColor="#eb2f96" onClick={onToggleLike} /> : <HeartOutlined onClick={onToggleLike} />,
          <MessageOutlined onClick={onToggleComment} />,

          <Popover
            key="ellipsis"
            content={
              <Button.Group>
                {id && post.UserId === id ? (
                  <div>
                    <Button>수정</Button>
                    <Button type="danger" onClick={onRemovePost(post.id)}>
                      삭제
                    </Button>
                  </div>
                ) : (
                  <Button>신고</Button>
                )}
              </Button.Group>
            }
          >
            <EllipsisOutlined />
          </Popover>,
        ]}
        title={post.RetweetId ? `${post.User.nickname}님이 리트윗했습니다.` : null}
        extra={<FollowButton post={post} onUnfollow={onUnfollow} onFollow={onFollow} />}
      >
        {post.RetweetId && post.Retweet ? (
          <Card cover={post.Retweet.Images[0] && <PostImages images={post.Retweet.Images} />}>
            <span style={{ float: 'right ' }}>{moment(post.createdAt).format('YYYY.MM.DD')}</span>
            <Card.Meta
              avatar={
                <Link href={{ pathname: '/user', query: { id: post.Retweet.User.id } }} as={`/user/${post.Retweet.User.id}`}>
                  <a>
                    <Avatar>{post.Retweet.User.nickname[0]}</Avatar>
                  </a>
                </Link>
              }
              title={post.Retweet.User.nickname}
              description={<PostCardContent postData={post.Retweet.content} />} // a tag x -> Link
            />
          </Card>
        ) : (
          <>
            <span style={{ float: 'right ' }}>{moment(post.createdAt).format('YYYY.MM.DD')}</span>
            <Card.Meta
              avatar={
                <Link href={{ pathname: '/user', query: { id: post.User.id } }} as={`/user/${post.User.id}`}>
                  <a>
                    <Avatar>{post.User.nickname[0]}</Avatar>
                  </a>
                </Link>
              }
              title={post.User.nickname}
              description={<PostCardContent postData={post.content} />} // a tag x -> Link
            />
          </>
        )}
      </Card>
      {/* {console.log('post:', post)} */}
      {commentFormOpened && (
        <>
          <CommentForm post={post} />
          <List
            header={`${post.Comments ? post.Comments.length : 0} 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments || []}
            renderItem={(comment) => {
              if (!comment.User) return <></>;
              return (
                <li>
                  <Comment
                    author={comment.User.nickname}
                    avatar={
                      <Link
                        href={{
                          pathname: '/user',
                          query: { id: comment.User.id },
                        }}
                        as={`/user/${comment.User.id}`}
                      >
                        <a>
                          <Avatar>{comment.User.nickname[0]}</Avatar>
                        </a>
                      </Link>
                    }
                    content={comment.content}
                  />
                </li>
              );
            }}
          />
        </>
      )}
    </CardWrapper>
  );
});

PostCard.propTypes = {
  post: T.shape({
    id: T.number,
    User: T.object,
    content: T.string,
    img: T.string,
    createdAt: T.any,
    Comments: T.array,
  }),
};

export default PostCard;
