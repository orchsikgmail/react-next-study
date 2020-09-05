import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input, Button } from 'antd';

import { backUrl } from '../config/config';
import { ADD_POST_REQUEST, UPLOAD_IMAGES_REQUEST, REMOVE_IMAGE } from '../reducers/post';

const PostForm = () => {
  const imageInput = useRef();

  const dispatch = useDispatch();
  const { id } = useSelector((state) => state.user.me);
  const { imagePaths, isAddingPost, postAdded } = useSelector((state) => state.post);

  const [text, setText] = useState('');

  useEffect(() => {
    setText('');
  }, [postAdded === true]);

  const onChangeText = useCallback((e) => {
    setText(e.target.value);
  }, []);

  const onChangeImages = useCallback((e) => {
    console.log(e.target.files);
    const imageFormData = new FormData();

    [].forEach.call(e.target.files, (file) => {
      imageFormData.append('image', file);
    });

    dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData,
    });
  }, []);

  const onClickImageUpload = useCallback(() => {
    imageInput.current && imageInput.current.click();
  }, [imageInput.current]);

  const onRemoveImage = useCallback(
    (index) => () => {
      dispatch({
        type: REMOVE_IMAGE,
        index,
      });
    },
    [],
  );

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (!text || !text.trim()) return alert('게시글을 작성하세요');

      const formData = new FormData();
      imagePaths.forEach((image) => {
        formData.append('image', image);
      });
      formData.append('content', text.trim());

      dispatch({
        type: ADD_POST_REQUEST,
        data: formData,
      });
    },
    [text, imagePaths],
  );

  return (
    <Form style={{ margin: '10px 0px 20px' }} encType="multipart/form-data" onSubmitCapture={onSubmitForm}>
      <Input.TextArea maxLength={200} placeholder="오늘 무슨 일이 있었나요?" value={text} onChange={onChangeText} />
      <div style={{ marginTop: 5 }}>
        <input type="file" hidden multiple ref={imageInput} onChange={onChangeImages} />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button type="primary" htmlType="submit" style={{ float: 'right' }} loading={isAddingPost}>
          포스팅
        </Button>
      </div>
      <div>
        {imagePaths.map((imagePath, i) => (
          <div key={imagePath} style={{ display: 'inline-block' }}>
            <img src={`${backUrl}/${imagePath}`} alt={imagePath} style={{ width: '200px' }} />
            <div>
              <Button onClick={onRemoveImage(i)}>삭제</Button>
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
};

export default PostForm;
