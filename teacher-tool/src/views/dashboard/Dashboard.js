import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CContainer,
  CFormTextarea,
  CButton,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CCardText,
  CFormInput,
  CSpinner,
} from '@coreui/react'
import CIcon from "@coreui/icons-react";
import { cilGlobeAlt, cilPeople, cilLockLocked, cilBuilding, cilShortText, cilThumbUp } from '@coreui/icons'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import './Dashboard.css' // Import the CSS file
import apiService from '../../services/apiService'
import { v4 as uuidv4 } from 'uuid';


const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [privacy, setPrivacy] = useState("Privacy");
  const [showParents, setShowParents] = useState(false);
  const [showClasses, setShowClasses] = useState(false);
  const [posts, setPosts] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyText, setReplyText] = useState('');
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [visibleComments, setVisibleComments] = useState({});
  const [classData, setClassData] = useState([]);
  const [fetchTrigger, setFetchTrigger] = useState(true);
  const [selectedParent, setSelectedParent] = useState(null);
  const [error, setError] = useState(null);


  const parentsData = [
    { id: 1, name: "Parent" },
    { id: 2, name: "Parent 2" },
    { id: 3, name: "Parent 3" },
  ];

  useEffect(() => {
    const fetchClassList = async () => {
      const data = await apiService.getClassList();

      const classList = data.result.data

      // Generate tableData dynamically
      const tableData = classList.map(item => ({ ...item }));

      setClassData(tableData)
    }
    const fetchPosts = async () => {
      try {
        const userNameLocal = localStorage.getItem('name');
        const postLocal = localStorage.getItem('posts');
        const preferred_language = localStorage.getItem('preferred_language');
        let data = JSON.parse(postLocal)

        const showPost = data.data.map((eachPost) => {
          eachPost.user.name = eachPost.user.name == userNameLocal ? "You" : eachPost.user.name
          // if(preferred_language != eachPost.language){
          //   eachPost.post = await apiService.translate({
          //     preferred_language,
          //     actual_language : eachPost.language,
          //     post : eachPost.post
          //   })
          // }
          eachPost.timestamp =  getTimeDifference(eachPost.createdAt)
          return eachPost
        })
        setPosts(showPost);

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
    fetchClassList();
    if (fetchTrigger) {
      fetchPosts();
      setFetchTrigger(false)
    };
  }, [fetchTrigger]);

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
    let tempPost = {data : updatedPosts}
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
    let tempPost = {data : updatedPosts}
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


  const handlePrivacySelect = (option) => {
    setPrivacy(option);
    setShowParents(option === "Parent"); // Show Parents dropdown only if "Parent" is selected
    setShowClasses(option === "Class"); // Show Parents dropdown only if "Parent" is selected
  };
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
  
  const handlePost = () => {
    const postLocal = localStorage.getItem('posts') || null;
    const userNameLocal = localStorage.getItem('name');
      
    let posts = JSON.parse(postLocal)

    let postObj = {}
    postObj.id = generateUUID()
    postObj.createdAt = new Date()
    postObj.user = {
      name: userNameLocal,
      profilePicture : "https://via.placeholder.com/40"
    }
    postObj.post = status
    postObj.language = localStorage.getItem('preferred_language');
    postObj.privacy = privacy
    postObj.target = privacy == 'Parent' ?  [selectedParent?.name] : []
    postObj.comments =  []
    if(!posts?.data) posts = { data : []}
    posts.data.push(postObj)
    posts = JSON.stringify(posts)
    localStorage.setItem('posts', posts);
    setFetchTrigger(true)
    setStatus("")

    // {
    //   id: 101,
    //   user: { name: "Jane Doe" },
    //   text: "Nice post!",
    //   replies: [
    //     {
    //       id: 201,
    //       user: { name: "John Doe" },
    //       text: "Thanks!"
    //     }
    //   ]
    // }
      
  };

  const handleSelect = (parent) => {
    setSelectedParent(parent);
    // Send `parent.id` to backend for handling
    console.log("Selected Parent ID:", parent.id);
  };

  return (
    <CContainer className="status-container">
      <CFormTextarea
        className="status-input"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        placeholder="What's on your mind?"
        rows={3}
      />
      <div className="status-actions">
        <CDropdown>
          <CDropdownToggle color="light" className="dropdown-toggle">
            <CIcon icon={cilLockLocked} /> {privacy}
          </CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem onClick={() => handlePrivacySelect("Public")}>
              <CIcon icon={cilGlobeAlt} /> Public
            </CDropdownItem>
            <CDropdownItem onClick={() => handlePrivacySelect("Parent")}>
              <CIcon icon={cilPeople} /> Parent
            </CDropdownItem>
            <CDropdownItem onClick={() => handlePrivacySelect("Class")}>
              <CIcon icon={cilBuilding} /> Class
            </CDropdownItem>
          </CDropdownMenu>
        </CDropdown>

        {showParents && (
          <CDropdown>
          <CDropdownToggle color="light" className="dropdown-toggle">
            <CIcon icon={cilPeople} /> {selectedParent ? selectedParent.name : "Parents"}
          </CDropdownToggle>
          <CDropdownMenu>
            {parentsData.map((parent) => (
              <CDropdownItem key={parent.id} onClick={() => handleSelect(parent)}>
                {parent.name}
              </CDropdownItem>
            ))}
          </CDropdownMenu>
        </CDropdown>
        )}
        {showClasses && (
          <CDropdown>
            <CDropdownToggle color="light" className="dropdown-toggle">
              <CIcon icon={cilBuilding} /> Classes
            </CDropdownToggle>
            <CDropdownMenu>
              {classData.map((cls) => (
                <CDropdownItem key={cls.id}>{cls.name}</CDropdownItem>
              ))}
            </CDropdownMenu>
          </CDropdown>
        )}

        <CButton color="primary" className="post-button" onClick={handlePost}>
          Post
        </CButton>
      </div>
      <div className="grid grid-cols-2 gap-4 p-4">
        {posts.map((post) => (
          <CCard key={post.id} className="w-full m-4">
            <CCardBody>
              {/* Post Header */}
              <div className="post-header">
                <img
                  src={'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'}
                  alt="Profile"
                  className="profile-picture"
                />
                <div className="post-user-info">
                  <strong>{post.user.name}</strong>
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
                      <strong>{comment.user?.name || localStorage.getItem('name') }:</strong> {comment.text}
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
                        <strong>{reply.user?.name || localStorage.getItem('name') }:</strong> {reply.text}
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
                <div className='comment-text-button'>
                <CFormInput
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                />
                </div>
                <div className='comment-text-button'>
                <CButton
                  color="primary"
                  size="sm"
                  onClick={() => handleAddComment(post.id)}
                >
                  Post Comment
                </CButton>

                </div>
              </div>
            </CCardBody>
          </CCard>
        ))}

      </div>

    </CContainer>

  );
}

export default Dashboard
