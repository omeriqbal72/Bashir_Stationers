import React, { useEffect, useState } from 'react'; // Import useState
import { Rate, Progress, Typography } from 'antd';
import Loader from '../Loader/Loader';
import ImageGallery from 'react-image-gallery'; // Import the ImageGallery component
import 'react-image-gallery/styles/css/image-gallery.css'; // Change to this line
import '../../css/comments.css';

const { Title } = Typography;

const CommentsSection = ({ comments, isLoading, isError, error }) => {
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [currentImages, setCurrentImages] = useState([]);
    if (isLoading) {
        return <Loader />;
    }

    if (isError) {
        return <div>Error: {error.message || "Something went wrong while fetching comments."}</div>;
    }

    const ratingCounts = comments.reduce((acc, comment) => {
        acc[comment.rating] = (acc[comment.rating] || 0) + 1;
        return acc;
    }, {});

    const totalComments = comments.length;

    const handleImageClick = (pictures) => {
        const images = pictures.map((picture) => ({
            original: `http://localhost:8080/${picture}`,
            thumbnail: `http://localhost:8080/${picture}`, // Use the same image for thumbnail
        }));
        setCurrentImages(images);
        setIsGalleryOpen(true);
    };

    const closeGallery = () => {
        setIsGalleryOpen(false);
    };

    // useEffect({

    // }, [])

    return (
        <div className="comments-section">
            <div className="comments-heading">
            <h2>Reviews</h2>
            </div>
           
            <div className="rating-distribution-wrapper">
                <div className="rating-distribution">
                    <Title level={4} className="distribution-title">Rating Distribution</Title>
                    {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="rating-bar">
                            <Rate value={star} disabled className="rating-stars" />
                            <Progress
                                percent={(ratingCounts[star] || 0) * 100 / totalComments}
                                showInfo={false}
                                strokeColor={star === 5 ? '#52c41a' : star === 4 ? '#73d13d' : star === 3 ? '#faad14' : '#f5222d'}
                                className="progress-bar"
                            />
                            <span className="rating-count">{ratingCounts[star] || 0}</span>
                        </div>
                    ))}
                </div>
            </div>

            {comments && comments.length > 0 ? (
                <div className="comments-section-wrap">
                    <ul className="comments-list">
                        {comments.map((comment, commentIndex) => (
                            <li key={comment._id} className="comment-item">
                                <p className="comment-author">
                                    <strong>{comment.user?.firstName || "Anonymous"}</strong>
                                    <Rate value={comment.rating} disabled className="comment-rating" />
                                </p>
                                <p className="comment-content">{comment.content || "No comment content available."}</p>
                                <div className="comment-content-picture">
                                    {comment?.pictures?.length > 0 ? (
                                        comment.pictures.map((picture, index) => (
                                            <img
                                                key={index}
                                                src={`http://localhost:8080/${picture}`}
                                                alt={`Comment Image ${index + 1}`}
                                                onClick={() => handleImageClick(comment.pictures)} // Pass the commentIndex instead
                                                style={{ cursor: 'pointer', margin: '0 5px', width: '100px', height: '100px', objectFit: 'cover' }}
                                            />
                                        ))
                                    ) : (
                                        <p>No images available</p>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>No comments yet. Be the first to comment!</p>
            )}

            {isGalleryOpen && (
                <div className="gallery-overlay" onClick={closeGallery}>
                    <div className="gallery-content" onClick={(e) => e.stopPropagation()}>
                        <ImageGallery
                            items={currentImages}
                            showThumbnails={true}
                            showFullscreenButton={true}
                            showPlayButton={false}
                            onClose={closeGallery}
                            useBrowserFullscreen={false}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommentsSection;
