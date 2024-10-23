import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Rate, Button, Upload } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import '../../css/reviews/addreview.css';
import Loader from '../Loader/Loader';

const AddReview = () => {
    const location = useLocation();
    const { product = null } = location.state || {};
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [rating, setRating] = useState(0);
    const [errorMsg, setErrorMsg] = useState('');
    const [images, setImages] = useState([]);
    const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
    console.log(product)
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
            if (!product._id) {
                setErrorMsg('Invalid product data');
                return;
            }
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
        if (product) {
            setLoading(false);
        }
    }, [product]);

    if (loading) {
        return <Loader height={100} />;
    }


    if (!product || !product._id) {
        return <p className="error-message">Product not available. It may have been deleted or removed</p>;
    }


    return (
        <div className="add-review-container">
            <div className="add-review-right">
                <h2>Product Details</h2>

                <div className="add-review-product-info">
                    <div className="add-review-right-img">
                        {product?.images?.length > 0 ? (
                            <img
                                src={`http://localhost:8080/${product.images[0]}`}
                                alt={product.name || 'Unknown Product'}
                            />
                        ) : (
                            <p>No images available</p>
                        )}
                    </div>



                </div>

                <div className='add-review-details'>
                    <p><strong>Name:</strong> {product.name}</p>
                    <p><strong>Price: </strong>RS.{product.price}</p>

                </div>

                <div className='add-review-rate-product'>
                    <Rate value={product.averageRating || 5} disabled />
                </div>
            </div>
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
                        placeholder="Write your review here...."
                        required
                        className="add-review-description"
                    />

                    <div className="add-review-image-upload">
                        <Upload
                            multiple
                            accept="image/*"
                            beforeUpload={() => false}
                            fileList={images}
                            listType='picture'
                            onChange={handleImageChange}
                        >
                            <Button
                                style={{
                                    height: '3rem',
                                 
                                    borderRadius:'0px'
                                }}
                                icon={<UploadOutlined style={{ fontSize: '2rem' , color:'gray'  }} />}
                            > 
                            
                            Select Images (Max 2)</Button>
                           
                        </Upload>
                        
                    </div>
                    <div className="add-review-submit">
                        <button type="submit">Publish Review</button>
                    </div>

                    {errorMsg && <p className="add-review-error">{errorMsg}</p>}
                </form>
            </div>

        </div>
    );
};

export default AddReview;
