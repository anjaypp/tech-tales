import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import login from '../../images/Login.svg';
import { Link } from 'react-router-dom';
import styles from './Login.module.css';

const Login = () => {
  const [user, setUser] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const updateUser = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };



  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });

      const data = await response.json();

      if (response.ok && data.authToken && data.role) {  // Ensure tokens and role are received
        // Save token and role to local storage
        localStorage.setItem('authToken', data.authToken);  // Use data.authToken here
        localStorage.setItem('role', data.role);

        // Navigate based on user role
        if (data.role === 'admin') {
          navigate('/admin', { replace: true });
        } else if (data.role === 'user') {
          navigate('/home', { replace: true });
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again later.', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className={styles['login-container']}>
      <Row className="align-items-center">
        <Col md={6} className={styles['login-form']}>
          <h2 className={styles['welcome-text']}>Welcome back!</h2>
          <p className={styles['description-text']}>Please enter your credentials to access your account.</p>
          
          {error && <p className="text-danger">{error}</p>}  {/* Display error if any */}

          <Form className={styles.form} onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername">
              <Form.Control
                type="text"
                placeholder="Username"
                name="username"
                className={styles['form-input']}
                value={user.username}
                onChange={updateUser}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                className={styles['form-input']}
                value={user.password}
                onChange={updateUser}
                required
              />
            </Form.Group>
            <div className={styles['forgot-password']}>
              <a href="#">Forgot Password?</a>
            </div>
            <Button type="submit" className={styles['login-button']} disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </Form>

          <p className={styles['register-text']}>Not a member? <Link to="/register">Register now</Link></p>
        </Col>

        <Col md={6} className={styles['illustration-section']}>
          <div className={styles['illustration']}>
            <img src={login} alt="Login illustration" />
          </div>
          <p className={styles['app-promotion-text']}>Stay informed with the latest in technology with <strong>TechTales</strong></p>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;