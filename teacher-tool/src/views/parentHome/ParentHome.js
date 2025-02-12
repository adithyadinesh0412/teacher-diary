import React, { useState, useEffect } from 'react';
import { CCard, CCardBody, CCardText, CButton, CFormInput, CFormTextarea } from '@coreui/react';
import './PostComponent.css';
import CIcon from '@coreui/icons-react';
import { cilShortText, cilThumbUp } from '@coreui/icons';
// 
const PostComponent = () => {
  const [posts, setPosts] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyText, setReplyText] = useState('');
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [visibleComments, setVisibleComments] = useState({});
  const [fetchTrigger, setFetchTrigger] = useState(true);
  const preferred_language = localStorage.getItem('preferred_language');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postLocal = localStorage.getItem('posts');
        let data = JSON.parse(postLocal)
        const userNameLocal = localStorage.getItem('name');
        const showPost = data.data.map(async (eachPost) => {
          if (eachPost.privacy == "Parent" && eachPost.target.includes(userNameLocal)) {
            eachPost.timestamp = getTimeDifference(eachPost.createdAt)
            eachPost.user.name = eachPost.user.name == userNameLocal ? "You" : eachPost.user.name
            eachPost.post = await apiService.translate({
              preferred_language,
              actual_language : eachPost.language,
              post : eachPost.post
            })
            return eachPost
          }
        })
        setPosts(showPost.filter((postt) => postt != null || postt != undefined));


        // Initialize visible comments for each post
        const initialVisibleComments = {};
        data.data.forEach(post => {
          initialVisibleComments[post.id] = 2;
        });
        setVisibleComments(initialVisibleComments);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
    if (fetchTrigger) {
      fetchPosts();
      setFetchTrigger(false)
    };
  }, []);

  const getTimeDifference = (createdAt) => {
    const now = new Date();
    const diffInMs = now - new Date(createdAt);
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${diffInDays} days ago`;
  };

  const handleAddComment = (postId) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, { id: Date.now(), text: newComment, replies: [] }],
        };
      }
      return post;
    });
    let tempPost = { data: updatedPosts }
    tempPost = JSON.stringify(tempPost)
    localStorage.setItem('posts', tempPost);

    // setPosts(updatedPosts);
    setFetchTrigger(true)
    setNewComment('');
  };

  const generateUUID = () => {
    const newUUID = uuidv4();
    console.log("Generated UUID:", newUUID);
    return newUUID;
  };
  const toggleComments = (postId) => {
    const commentsSection = document.getElementById(`comments-section-${postId}`);
    if (commentsSection) {
      commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
    }
  };
  const handleAddReply = (postId, commentId) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: [...comment.replies, { id: Date.now(), text: replyText }],
              };
            }
            return comment;
          }),
        };
      }
      return post;
    });
    let tempPost = { data: updatedPosts }
    tempPost = JSON.stringify(tempPost)
    localStorage.setItem('posts', tempPost);
    setFetchTrigger(true)
    setReplyText('');
    setActiveReplyId(null);
  };

  const loadMoreComments = (postId) => {
    setVisibleComments(prev => ({
      ...prev,
      [postId]: prev[postId] + 2
    }));
  };

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {posts.map((post) => (
        <CCard key={post.id} className="w-full">
          <CCardBody>
            {/* Post Header */}
            <div className="post-header">
              <img
                src={'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'}
                alt="Profile"
                className="profile-picture"
              />
              <div className="post-user-info">
                <strong>{post?.user?.name}</strong>
                <span className="post-time">{post.timestamp}</span>
              </div>
            </div>

            {/* Post Content */}
            <CCardText className="post-content">{post.post}</CCardText>

            {/* Action Buttons */}
            <div className="post-actions">
              <CButton color="link">
                <CIcon icon={cilThumbUp} size="l" className="me-1" />
              </CButton>
              <CButton color="link">
                <CIcon icon={cilShortText} onClick={() => toggleComments(post.id)} size="l" className="me-1" />
              </CButton>

              {/* <CIcon icon={cilShare} /> */}
            </div>

            {/* Comments Section */}
            <div id={`comments-section-${post.id}`} className="comments-section">
              {post.comments.slice(0, visibleComments[post.id]).map((comment) => (
                <div key={comment.id} className="comment">
                  <div className="comment-content">
                    <strong>{comment.user?.name || 'Anonymous'}:</strong> {comment.text}
                  </div>
                  <CButton
                    color="link"
                    size="sm"
                    onClick={() => setActiveReplyId(comment.id)}
                  >
                    Reply
                  </CButton>

                  {/* Reply Input */}
                  {activeReplyId === comment.id && (
                    <div className="reply-input">
                      <CFormTextarea
                        rows={1}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply..."
                      />
                      <CButton
                        color="primary"
                        size="sm"
                        onClick={() => handleAddReply(post.id, comment.id)}
                      >
                        Post Reply
                      </CButton>
                    </div>
                  )}

                  {/* Replies */}
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="reply">
                      <strong>{reply.user?.name || 'Anonymous'}:</strong> {reply.text}
                    </div>
                  ))}
                </div>
              ))}

              {/* View Previous Comments Button */}
              {post.comments.length > visibleComments[post.id] && (
                <CButton
                  color="link"
                  className="mt-2 text-sm"
                  onClick={() => loadMoreComments(post.id)}
                >
                  View Previous Comments ({post.comments.length - visibleComments[post.id]} more)
                </CButton>
              )}
            </div>

            {/* Add Comment Input */}
            <div className="add-comment">
              <CFormInput
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
              />
              <CButton
                color="primary"
                size="sm"
                onClick={() => handleAddComment(post.id)}
              >
                Post Comment
              </CButton>
            </div>
          </CCardBody>
        </CCard>
      ))}
    </div>
  );
};

export default PostComponent;