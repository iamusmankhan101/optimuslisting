import React, { useState, useEffect } from 'react';
import './Comments.css';

const Comments = ({ propertyListingId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? 'http://localhost:3000' 
    : '';

  useEffect(() => {
    fetchComments();
  }, [propertyListingId]);

  const fetchComments = async () => {
    try {
      const url = propertyListingId 
        ? `${API_BASE}/api/comments/get?property_listing_id=${propertyListingId}`
        : `${API_BASE}/api/comments/get`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setComments(data.data);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/api/comments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment: newComment,
          property_listing_id: propertyListingId || null,
          created_by: createdBy || null
        }),
      });

      const data = await response.json();

      if (data.success) {
        setNewComment('');
        setCreatedBy('');
        fetchComments();
      } else {
        setError(data.error || 'Failed to create comment');
      }
    } catch (err) {
      setError('Error creating comment');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comments-container">
      <h3>Comments</h3>
      
      <form onSubmit={handleSubmit} className="comment-form">
        <input
          type="text"
          placeholder="Your name (optional)"
          value={createdBy}
          onChange={(e) => setCreatedBy(e.target.value)}
          className="comment-input"
        />
        <textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="comment-textarea"
          rows="3"
        />
        {error && <div className="error-message">{error}</div>}
        <button type="submit" disabled={loading} className="comment-submit">
          {loading ? 'Submitting...' : 'Submit Comment'}
        </button>
      </form>

      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <span className="comment-author">
                  {comment.created_by || 'Anonymous'}
                </span>
                <span className="comment-date">
                  {new Date(comment.created_at).toLocaleString()}
                </span>
              </div>
              <div className="comment-text">{comment.comment}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;
