import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Modal,
  Alert
} from "react-bootstrap";
import ReactHtmlParser from 'html-react-parser';
import axios from "axios";

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch pending Blogs
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/admin/blogs", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`
        }
      })
      .then((response) => {
        setBlogs(response.data);
      })
      .catch((err) => {
        console.error("Error fetching Blogs:", err);
        setError("Failed to load Blogs.");
      });
  }, []);

  // Approve post
const handleApprove = async (blogId) => {
  try {
    await axios.patch(
      `http://localhost:4000/api/admin/blog/${blogId}/approve`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );
    // Update the status locally after approval
    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) =>
        blog._id === blogId ? { ...blog, status: 'active' } : blog
      )
    );
  } catch (err) {
    setError('Failed to approve the post');
  }
};

// Reject post
const handleReject = async (blogId) => {
  try {
    await axios.patch(
      `http://localhost:4000/api/admin/blog/${blogId}/reject`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );
    // Update the status locally after rejection
    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) =>
        blog._id === blogId ? { ...blog, status: 'rejected' } : blog
      )
    );
  } catch (err) {
    setError('Failed to reject the post', err);
  }
};


  // View post content in modal
  const handleViewPost = (blog) => {
    setSelectedPost(blog);
    setShowModal(true);
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg={8}>
          <h1>Blog Management</h1>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Date Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    No pending Blogs
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog._id}>
                    <td>{blog.title}</td>
                    <td>{blog.authorId.name}</td>
                    <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Button
                        variant="info"
                        onClick={() => handleViewPost(blog)}
                      >
                        View
                      </Button>
                      {blog.status === "pending" && (
                        <>
                          <Button
                            variant="success"
                            onClick={() =>
                              handleApprove(blog._id)
                            }
                            className="ms-2"
                          >
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() =>
                              handleReject(blog._id)
                            }
                            className="ms-2"
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          {/* Modal to view post content */}
          {selectedPost && (
            <Modal show={showModal} onHide={() => setShowModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>{ReactHtmlParser(selectedPost.title)}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {" "}
                {/* Correct closing tag here */}
                <h5>Content:</h5>
                <p>{ReactHtmlParser(selectedPost.content)}</p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default BlogManagement;
