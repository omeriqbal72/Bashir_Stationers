import React, { useState } from 'react';
import axios from 'axios';
import { Rate, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons'; 
import '../../css/addreview.css'; 

const AddReview = ({ productId, productDetails }) => {
  const [comments, setComments] = useState([]); 
  const [newComment, setNewComment] = useState(''); 
  const [rating, setRating] = useState(0); 
  const [errorMsg, setErrorMsg] = useState('');
  const [images, setImages] = useState([]); 

  const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

  // Handle image change
  const handleImageChange = ({ fileList }) => {
    const validImages = [];
    let hasError = false;

    fileList.forEach(file => {
      if (file.size > MAX_FILE_SIZE) {
        setErrorMsg(`File ${file.name} is too large. Maximum size is 3MB.`);
        hasError = true;
      } else {
        validImages.push(file);
      }
    });

    if (!hasError && validImages.length <= 2) {
      setImages(validImages);
      setErrorMsg('');
    } else if (validImages.length > 2) {
      setErrorMsg('Please select only 2 images.');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment || !rating || images.length !== 2) {
      setErrorMsg('Comment, rating, and images are required.');
      return;
    }

    const formData = new FormData();
    formData.append('content', newComment);
    formData.append('rating', rating);

    images.forEach(image => {
      formData.append('images', image.originFileObj);
    });

    try {
      const res = await axios.post(`/products/${productId}/comments`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setComments([...comments, res.data]);
      setNewComment('');
      setRating(0);
      setImages([]);
      setErrorMsg('');
    } catch (err) {
      console.error('Error posting comment:', err);
      setErrorMsg('Failed to submit comment');
    }
  };

  return (
    <div className="add-review-container">
      <div className="add-review-left">
      <h1>Add a Review</h1>
        <form onSubmit={handleCommentSubmit}>
         

          <div className="add-review-rating">
            <h2>Rate: </h2>
            <Rate onChange={setRating} value={rating}  />
          </div>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment here"
            required
            className="add-review-description"
          />
         

          {/* Image Upload with UploadOutlined button */}
          <div className="add-review-image-upload">
            <Upload 
              multiple
              accept="image/*"
              beforeUpload={() => false} // Disable auto-upload
              fileList={images}
              listType='picture'
              onChange={handleImageChange}
            >
              <Button icon={<UploadOutlined />}>Select Images (Max 2)</Button>
            </Upload>
          </div>
          <div className="add-review-submit">
             <button type="submit" >Publish Review</button>
          </div>
         
          {errorMsg && <p className="add-review-error">{errorMsg}</p>}
        </form>
      </div>
      <div className="add-review-right">
        <h3>Product Details</h3>
        <div className="add-review-product-info">
          {/* <p>Name: {productDetails.name}</p>
          <p>Price: ${productDetails.price}</p>
          <p>Description: {productDetails.description}</p> */}
        </div>
      </div>
    </div>
  );
};

export default AddReview;
