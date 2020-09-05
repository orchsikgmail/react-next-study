import React from 'react';
import { useSelector } from 'react-redux';
import T from 'prop-types';
import { Helmet } from 'react-helmet';

import { backUrl } from '../config/config';
import { LOAD_POST_REQUEST } from '../reducers/post';

const Post = ({ id }) => {
  const { singlePost } = useSelector((state) => state.post);
  if (!singlePost) return null;

  return (
    <>
      <Helmet>
        <title>{`${singlePost.User.nickname}님의 글`}</title>
        <meta name="description" content={singlePost.content} />
        <meta property="og:title" content={`${singlePost.User.nickname}님의 게시글`} />
        <meta property="og:description" content={singlePost.content} />
        <meta property="og:image" content={singlePost.Images[0] && `${backUrl}/${singlePost.Images[0].src}`} />
        <meta property="og:url" content={`http://localhost:3060/post/${id}`} />
      </Helmet>
      <div itemScope="content">{singlePost.content}</div>
      <div itemScope="author">{singlePost.User.nickname}</div>
      <div>{singlePost.Images[0] && <img src={`${backUrl}/${singlePost.Images[0].src}`} />}</div>
    </>
  );
};

Post.getInitialProps = async (context) => {
  context.store.dispatch({
    type: LOAD_POST_REQUEST,
    data: context.query.id,
  });
  return { id: parseInt(context.query.id, 10) };
};

Post.propTypes = {
  id: T.number.isRequired,
};

export default Post;
