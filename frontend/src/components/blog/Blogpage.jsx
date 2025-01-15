import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Image, Form, Button, Alert } from 'react-bootstrap';
import ReactHtmlParser from 'html-react-parser';
import { useRef } from 'react';
import styles from './Blogpage.module.css';
import axios from 'axios';
import NavigationBar from '../reusable/Navbar';

const Blogpage = () => {
    const { id } = useParams();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [commentError, setCommentError] = useState(null);
    const [likeCount, setLikeCount] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);
    const [blog, setBlog] = useState(null);
    const [error, setError] = useState(null);
    const commentSectionRef = useRef(null);

    const fetchComments = async () => {
        try {
            const res = await axios.get(`http://localhost:4000/api/interaction/${id}/comments`);
            setComments(res.data);
        } catch (err) {
            console.error('Error fetching comments:', err);
        }
    };

    useEffect(() => {
        // Fetch the blog post data
        axios.get(`http://localhost:4000/api/blog/post/${id}`)
            .then(res => {
                setBlog(res.data);
            })
            .catch(err => {
                console.error('Error fetching blog:', err);
                if (err.response && err.response.status === 401) {
                    setError('This content is premium. Please upgrade your subscription.');
                } else {
                    setError('Failed to load blog. Please try again later.');
                }
            });
    
        // Fetch comments for the blog post
        fetchComments();
    
        // Fetch initial like status and count
        axios.get(`http://localhost:4000/api/interaction/${id}/likes`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        })
            .then(res => {
                setLikeCount(res.data.likeCount);
                setHasLiked(res.data.hasLiked);
            })
            .catch(err => {
                console.error('Error fetching like status:', err);
            });
    }, [id]);

    const handleLike = async () => {
        try {
            if (hasLiked) {
                await axios.delete(`http://localhost:4000/api/interaction/${id}/like`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
                });
                setLikeCount(likeCount - 1);
                setHasLiked(false);
            } else {
                await axios.post(
                    `http://localhost:4000/api/interaction/${id}/like`,
                    {},
                    { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }
                );
                setLikeCount(likeCount + 1);
                setHasLiked(true);
            }
        } catch (error) {
            console.error('Error liking/unliking post:', error);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        setCommentError(null);

        try {
            await axios.post(
                `http://localhost:4000/api/interaction/${id}/comment`,
                { content: newComment },
                { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }
            );
            
            // Fetch all comments again to ensure we have the complete data structure
            await fetchComments();
            
            // Clear the comment input
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
            setCommentError('Failed to add comment. Please try again.');
        }
    };

    const scrollToComments = () => {
        if (commentSectionRef.current) {
            commentSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    if (error) {
        return <Alert variant="danger" className="text-center">{error}</Alert>;
    }

    if (!blog) {
        return <p>Loading...</p>;
    }

    return (
        <>
        <NavigationBar/>
        <Container className={styles.postcontainer}>
            <Row className="justify-content-center">
                <Col lg={8}>
                    <h1 className={`${styles.title} text-start`}>{blog.title}</h1>
                    
                    <div className="d-flex align-items-center mb-3">
                        <Image
                            src={blog.authorImage || "https://via.placeholder.com/50"}
                            roundedCircle
                            width={50}
                            height={50}
                            alt="Author"
                            className="me-2"
                        />
                        <div className={`${styles.authorCard} text-start`}>
                            <p className="mb-1 fw-bold">{blog.authorId.username || blog.authorId}</p>
                            <p className="mb-0 text-muted">{new Date(blog.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <Col lg={8} className={`${styles.interactMenu} text-start mb-3`}>
                        <span onClick={handleLike} className={styles.interaction}>{hasLiked ? 'Unlike' : 'Like'} ({likeCount})</span>
                        <span onClick={scrollToComments} className={styles.interaction}>Comment</span>
                        <span className={styles.interaction}>Share</span>
                    </Col>

                    <Card className="p-4 mb-4">
                        <Card.Text className={styles.blogcontent}>
                            {ReactHtmlParser(blog.content)}
                        </Card.Text>
                    </Card>

                    <div ref={commentSectionRef}>
                        <h3 className='mt-4'>Comments</h3>
                        <Card className='mb-4 p-3'>
                            {comments.length > 0 ? (
                                comments.map((comment, index) => (
                                    <div key={comment._id || index} className='mb-3'>
                                        <div className='d-flex align-items-center mb-1'>
                                            <Image
                                                src={comment.authorImage || "https://via.placeholder.com/50"}
                                                roundedCircle
                                                width={30}
                                                height={30}
                                                alt="Author"
                                                className="me-2"
                                            />
                                            <strong>{comment.userId.username || comment.authorId}</strong>
                                        </div>
                                        <p>{comment.content}</p>
                                        <small className='text-muted'>
                                            {new Date(comment.createdAt).toLocaleString()}
                                        </small>
                                        <hr />
                                    </div>
                                ))
                            ) : (
                                <p>No comments yet. Be the first to comment!</p>
                            )}
                        </Card>

                        <Form onSubmit={handleAddComment} className="mb-4">
                            <Form.Group controlId="comment">
                                <Form.Label>Leave a comment:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your comment"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            {commentError && <Alert variant="danger">{commentError}</Alert>}
                            <Button variant="primary" type="submit" className='mt-2'>
                                Submit
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
        </>
    );
};

export default Blogpage;