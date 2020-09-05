import React, { useEffect, useRef, useCallback } from 'react';
import T from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { LOAD_HASHTAG_POSTS_REQUEST } from '../reducers/post';
import PostCard from '../containers/PostCard';

const Hashtag = ({ tag }) => {
  const dispatch = useDispatch();
  const countRef = useRef([]);

  const { hasMorePost, mainPosts } = useSelector((state) => state.post);

  const onScroll = useCallback(() => {
    if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
      const lastId = mainPosts[mainPosts.length - 1] && mainPosts[mainPosts.length - 1].id;
      if (!countRef.current.includes(lastId)) {
        dispatch({
          type: LOAD_HASHTAG_POSTS_REQUEST,
          lastId,
          data: tag,
        });
      }
      countRef.current.push(lastId);
    }
  }, [hasMorePost, mainPosts.length, tag]);

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [mainPosts.length]);

  return <div>{mainPosts && mainPosts.length > 0 && mainPosts.map((post) => <PostCard key={post.createdAt} post={post} />)}</div>;
};

Hashtag.getInitialProps = async (ctx) => {
  const { tag } = ctx.query;

  ctx.store.dispatch({
    type: LOAD_HASHTAG_POSTS_REQUEST,
    data: tag,
  });

  return { tag };
};

Hashtag.propTypes = {
  tag: T.string.isRequired,
};

export default Hashtag;
