import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Container, Card, Alert, Spinner, Badge } from 'react-bootstrap';
import axios from 'axios';
import styles from './SearchResults.module.css';
import NavigationBar from '../reusable/Navbar';

// Add the correct API base URL
const API_BASE_URL = 'http://localhost:4000';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get('query');

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        // Update to use the correct endpoint
        const response = await axios.get(`${API_BASE_URL}/api/blog/home`, {
          params: {
            search: query 
          },
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

       
        const blogs = response.data.blogs || response.data;
        setResults(Array.isArray(blogs) ? blogs : []);
      } catch (err) {
        console.error('Search error:', err);
        setError(err.response?.data?.message || 'An error occurred while searching');
      } finally {
        setLoading(false);
      }
    };

    if (!query?.trim()) {
      navigate('/home', { replace: true });
      return;
    }

    fetchSearchResults();
  }, [query, navigate]);


  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="danger" className="my-3">
          {error}
        </Alert>
      );
    }

    if (!Array.isArray(results)) {
      return (
        <Alert variant="danger" className="my-3">
          Invalid data format received from server
        </Alert>
      );
    }

    if (results.length === 0) {
      return (
        <Alert variant="info" className="my-3">
          No results found for "{query}". Try adjusting your search terms.
        </Alert>
      );
    }

    return results.map((blog) => (
      <Card key={blog._id} className={`${styles.blogCard} mb-4`}>
        {blog.image && (
          <Card.Img
            variant="top"
            src={
              blog.image
                ? `http://localhost:4000/uploads/${blog.image
                    .split("\\")
                    .pop()}`
                : "https://via.placeholder.com/400x200?text=No+Image"
            }
            className={styles.blogImage}
            alt={blog.title}
          />
        )}
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start">
            <Card.Title className={styles.blogTitle}>{blog.title}</Card.Title>
            {blog.isPremium && (
              <Badge bg="warning" text="dark">
                Premium
              </Badge>
            )}
          </div>
          
          <Card.Text className={styles.blogSummary}>{blog.summary}</Card.Text>
          
          <div className={styles.blogMeta}>
            {blog.categories?.map((category, index) => (
              <Badge 
                key={index} 
                bg="secondary" 
                className="me-2"
              >
                {category}
              </Badge>
            ))}
          </div>

          <div className={`${styles.blogFooter} mt-3`}>
            <small className="text-muted">
              By {blog.authorId?.username || 'Anonymous'}
            </small>
            <Link 
              to={`/blog/${blog._id}`} 
              className="btn btn-primary btn-sm"
            >
              Read More
            </Link>
          </div>
        </Card.Body>
      </Card>
    ));
  };

  return (
    <>
    <NavigationBar />
    <Container className="py-4">
      <div className={styles.searchHeader}>
        <h1>Search Results</h1>
        <p className="text-muted">
          Showing results for: "{query}"
        </p>
      </div>
      {renderContent()}
    </Container>
    </>
  );
};

export default SearchResults;