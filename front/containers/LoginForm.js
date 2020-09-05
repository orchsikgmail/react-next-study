import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button } from 'antd';
import Link from 'next/link';
import styled from 'styled-components';

import { loginRequestAction } from '../reducers/user';
import { useInput, TextInput } from '../pages/signup';

const LoginError = styled.div`
  color: red;
`;

const LoginForm = () => {
  const dispatch = useDispatch();
  const { isLoggingIn, logInErrorReason } = useSelector((state) => state.user);
  const [id, changeId] = useInput('');
  const [password, changePassword] = useInput('');

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      dispatch(loginRequestAction({ userId: id, password }));
    },
    [id, password],
  );

  return (
    <Form onSubmitCapture={onSubmit} style={{ marginLeft: 20 }}>
      <div>
        <label>아이디</label>
        <br />
        <TextInput required name="user-id" value={id} onChange={changeId} />
      </div>
      <div>
        <label name="user-password">비밀번호</label>
        <br />
        <TextInput required type="password" name="user-password" value={password} onChange={changePassword} />
      </div>
      <LoginError>{logInErrorReason}</LoginError>
      <div style={{ marginTop: 10 }}>
        <Button type="primary" htmlType="submit" loading={isLoggingIn}>
          로그인
        </Button>
        <Link href="/signup">
          <a>
            <Button>회원가입</Button>
          </a>
        </Link>
      </div>
    </Form>
  );
};

export default LoginForm;
