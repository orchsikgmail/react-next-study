import React, { useState, useCallback } from 'react';
import { Form, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { EDIT_NICKNAME_REQUEST } from '../reducers/user';

const NickNameEditForm = () => {
  const dispatch = useDispatch();
  const [editedName, setEditedName] = useState('');
  const { me, isEditingNickname } = useSelector((state) => state.user);

  const onChangeNickname = useCallback((e) => {
    setEditedName(e.target.value);
  }, []);

  const onEditNickname = useCallback(
    (e) => {
      e.preventDefault();
      dispatch({
        type: EDIT_NICKNAME_REQUEST,
        data: editedName,
      });
    },
    [editedName],
  );

  return (
    <Form
      style={{
        marginBottom: '20px',
        padding: '20px',
        border: '1px solid #d9d9d9',
      }}
      onSubmitCapture={onEditNickname}
    >
      <Input addonBefore="닉네임" value={editedName} onChange={onChangeNickname} />
      <Button type="primary" htmlType="submit" loading={isEditingNickname} style={{ marginTop: 5 }}>
        수정
      </Button>
    </Form>
  );
};
export default NickNameEditForm;
