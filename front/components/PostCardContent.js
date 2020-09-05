import React from 'react';
import T from 'prop-types';
import Link from 'next/link';

const PostCardContent = ({ postData }) => {
  return (
    <div>
      {postData.split(/(#[^\s]+)/).map((v) => {
        if (v.match(/#[^\s]+/))
          return (
            <Link
              // href={`/hashtag/${v.slice(1)}`} // 서버(express)쪽으로 링크되서 SPA가 아니라 새로고침 된다.
              // query로 보낸게 _app 에서 getInitialProps로 확인 가능하다.
              href={{ pathname: '/hashtag', query: { tag: v.slice(1) } }}
              as={`/hashtag/${v.slice(1)}`}
              key={v}
            >
              <a>{v}</a>
            </Link>
          );
        return v;
      })}
    </div>
  );
};

PostCardContent.prototype = {
  postData: T.string.isRequired,
};

export default PostCardContent;
