import React, { useState, useCallback, memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import T from 'prop-types';
import styled from 'styled-components';
import { Input, Form, Checkbox, Button } from 'antd';
import Router from 'next/router';

import { signUpRequestAction } from '../reducers/user';

export const TextInput = memo(({ name, value, onChange, required, type }) => {
  return (
    <div>
      <Input name={name} value={value} required={required} onChange={onChange} type={type || 'text'} />
    </div>
  );
});
TextInput.propTypes = {
  name: T.string,
  value: T.string,
  onChange: T.func,
  required: T.bool,
  type: T.string,
};

export const useInput = (initValue = null) => {
  const [value, setter] = useState(initValue);
  const handler = useCallback((e) => {
    setter(e.target.value);
  }, []);
  return [value, handler];
};

const SignUpError = styled.div`
  color: red;
`;

const Signup = () => {
  const dispatch = useDispatch();
  const { isSigningUp, me } = useSelector((state) => state.user);

  const [id, onChangeId] = useInput('');
  const [nick, onChangeNick] = useInput('');
  const [password, onChangePassword] = useInput('');

  const [passwordCheck, setPasswordCheck] = useState('');
  const [term, setTerm] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [termError, setTermError] = useState(false);

  useEffect(() => {
    if (!me) return;
    alert('로그인해서 메인페이지로 이동합니다.');
    Router.push('/');
  }, [me && me.id]);

  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordError(password !== e.target.value);
      setPasswordCheck(e.target.value);
    },
    [password],
  );

  const onChangeTerm = useCallback((e) => {
    setTerm(e.target.checked);
  }, []);

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();

      if (password !== passwordCheck) return setPasswordError(true);
      if (!term) return setTermError(true);

      return dispatch(
        signUpRequestAction({
          userId: id,
          password,
          nickname: nick,
        }),
      );
    },
    [id, nick, password, passwordCheck, term],
  );

  if (me) return null;
  return (
    <>
      <Form onSubmitCapture={onSubmit} style={{ padding: 10 }}>
        <div>
          <label htmlFor="user-id">ID</label>
          <br />
          <TextInput name="user-id" value={id} required onChange={onChangeId} />
        </div>

        <div>
          <label htmlFor="user-nick">NICK</label>
          <br />
          <TextInput name="user-nick" value={nick} required onChange={onChangeNick} />
        </div>

        <div>
          <label htmlFor="user-password">Password</label>
          <br />
          <TextInput type="password" name="user-password" value={password} required onChange={onChangePassword} />
        </div>

        <div>
          <label htmlFor="user-password-check">Password Check</label>
          <br />
          <TextInput type="password" name="user-password-check" value={passwordCheck} required onChange={onChangePasswordCheck} />
          {passwordError && <SignUpError>비밀번호가 일치하지 않습니다.</SignUpError>}
        </div>

        <div>
          <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>
            약관에 동의합니다.
          </Checkbox>
          {termError && <SignUpError>약관에 동의하세요.</SignUpError>}
        </div>

        <div style={{ marginTop: 10 }}>
          <Button type="primary" htmlType="submit" loading={isSigningUp}>
            회원가입
          </Button>
        </div>
      </Form>
    </>
  );
};

export default Signup;
