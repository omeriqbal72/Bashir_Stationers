import React from 'react';
import { Rate, Progress, Typography } from 'antd'; 
import '../../css/comments.css'

const { Title } = Typography;

const CommentsSection = ({ comments, isLoading, isError, error }) => {
    if (isLoading) {
        return <div>Loading comments...</div>;
    }

    if (isError) {
        return <div>Error: {error.message || "Something went wrong while fetching comments."}</div>;
    }

    const ratingCounts = comments.reduce((acc, comment) => {
        acc[comment.rating] = (acc[comment.rating] || 0) + 1;
        return acc;
    }, {});

    const totalComments = comments.length;

    return (
        <div className="comments-section">
            <h2>Reviews</h2>
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
                        {comments.map((comment) => (
                            <li key={comment._id} className="comment-item">
                                <p className="comment-author">
                                    <strong>{comment.user?.firstName || "Anonymous"}</strong>
                                    <Rate value={comment.rating} disabled className="comment-rating" />
                                </p>
                                <p className="comment-content">{comment.content || "No comment content available."}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>No comments yet. Be the first to comment!</p>
            )}
        </div>
    );
};

export default CommentsSection;
