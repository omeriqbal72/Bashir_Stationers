import React, { useState , useEffect } from 'react';
import axios from 'axios';
import { Rate, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons'; 
import { useLocation } from 'react-router-dom'; // Import useLocation
import '../../css/addreview.css'; 
import Loader from '../Loader/Loader';

const AddReview = () => {
    const location = useLocation(); // Get location object
    const { product } = location.state || {}; // Access product from state
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]); 
    const [newComment, setNewComment] = useState(''); 
    const [rating, setRating] = useState(0); 
    const [errorMsg, setErrorMsg] = useState('');
    const [images, setImages] = useState([]); 
  console.log(product)
    const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

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
            // Ensure product is defined before using it
            if (!product) {
                setErrorMsg('Invalid product data');
                return;
            }

            // Assuming your API endpoint expects the product data in a specific way
            const res = await axios.post(`/products/${product._id}/comments`, formData, {
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

    useEffect(() => {
      // Check if product data exists after the component mounts
      if (product) {
          setLoading(false); // Set loading to false if product is found
      }
  }, [product]); // Dependency on product

  if (loading) {
      return <Loader height={100} />; // Show loader while waiting for product
  }

  if (!product) {
      return <p>No product information available.</p>; // Fallback for no product
  }


    return (
        <div className="add-review-container">
            <div className="add-review-left">
                <h1>Add a Review</h1>
                <form onSubmit={handleCommentSubmit}>
                    <div className="add-review-rating">
                        <h2>Rate: </h2>
                        <Rate onChange={setRating} value={rating} />
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
                        <button type="submit">Publish Review</button>
                    </div>
                   
                    {errorMsg && <p className="add-review-error">{errorMsg}</p>}
                </form>
            </div>
            <div className="add-review-right">
                <h3>Product Details</h3>
                <div className="add-review-product-info">
                    <p>Name: {product.name}</p>
                    <p>Price: ${product.price}</p>
                    <p>Description: {product.description}</p>
                </div>
            </div>
        </div>
    );
};

export default AddReview;
