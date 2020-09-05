import React from 'react';
import T from 'prop-types';

const MyError = ({ statusCode }) => {
  return (
    <div>
      <h1>{statusCode} 에러 발생</h1>
    </div>
  );
};

MyError.defaultProps = {
  statusCode: 400,
};

MyError.getInitialProps = async (ctx) => {
  const statusCode = ctx.res ? ctx.res.statusCode : ctx.err ? ctx.err.statusCode : null;

  return { statusCode };
};

MyError.propTypes = {
  statusCode: T.number,
};

export default MyError;
