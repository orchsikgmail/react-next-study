import React, { useState, useCallback } from 'react';
import T from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';

import { backUrl } from '../config/config';
import ImagesZoom from './ImagesZoom';

const PostImages = ({ images }) => {
  const [showImagesZoom, setShowImagesZoom] = useState(false);

  const onZoom = useCallback(() => {
    setShowImagesZoom(true);
  }, []);

  const onClose = useCallback(() => {
    setShowImagesZoom(false);
  }, []);

  if (images.length === 1) {
    return (
      <div>
        <img key={images[0].src} src={`${backUrl}/${images[0].src}`} onClick={onZoom} />
        {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
      </div>
    );
  }

  if (images.length === 2) {
    return (
      <div>
        <img key={images[0].src} src={`${backUrl}/${images[0].src}`} onClick={onZoom} width="50%" />
        <img key={images[1].src} src={`${backUrl}/${images[1].src}`} onClick={onZoom} width="50%" />
        {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
      </div>
    );
  }

  return (
    <div>
      <div>
        <img key={images[0].src} src={`${backUrl}/${images[0].src}`} onClick={onZoom} width="50%" />
        <div style={{ display: 'inline-block', width: '50%', textAlign: 'center', verticalAlign: 'middle' }} onClick={onZoom}>
          <PlusOutlined />
          <br />
          {images.length - 1}개의 사진 더보기
        </div>
      </div>
      {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
    </div>
  );
};

PostImages.propTypes = {
  images: T.arrayOf(
    T.shape({
      src: T.string,
    }),
  ).isRequired,
};

export default PostImages;
