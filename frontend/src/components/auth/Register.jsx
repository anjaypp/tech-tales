import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useState } from "react";
import login from '../../images/Login.svg';
import { Link } from 'react-router-dom';
import styles from'./Register.module.css';

const Register = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Update form fields as user types
  const updateUser = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try{
      const response = await fetch('http://localhost:4000/auth/register',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });

      if(response.status === 201) {
        // Handle successful registration
        window.location.href = '/login';
      } else {
        // Handle registration error
        const data = await response.json();
        setError(data.message ||'Registration failed');
      }
     } catch(error) {
        setError('Network error. Please try again later.');
      }
    finally {
      setIsLoading(false);
    }
  };

   

  return (
    <Container className={styles['login-container']}>
      <Row className="align-items-center">
        <Col md={6} className={styles['login-form']}>
          <h2 className={styles['welcome-text']}>TechTales</h2>
          <p className={styles['description-text']}>
            Please enter your details to create an account.
          </p>
          
          {error && <p className="text-danger">{error}</p>}  {/* Display error message */}
          
          <Form className={styles.form}onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername" className="mb-3">
              <Form.Control 
                type="text" 
                name="username" 
                placeholder="Username" 
                className={styles['form-input']} 
                value={user.username} 
                onChange={updateUser}
                required
              />
            </Form.Group>
            
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Control 
                type="email" 
                name="email" 
                placeholder="Email" 
                className={styles['form-input']} 
                value={user.email} 
                onChange={updateUser}
                required
              />
            </Form.Group>
            
            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Control 
                type="password" 
                name="password" 
                placeholder="Password" 
                className={styles['form-input']} 
                value={user.password} 
                onChange={updateUser}
                required
              />
            </Form.Group>
            <Button type="submit" className={styles['login-button']}>Register</Button>
          </Form>
          
          <p className={styles['register-text']}>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </Col>

        {/* Right side with illustration */}
        <Col md={6} className={styles['illustration-section']}>
          <div className={styles['illustration']}>
            <img src={login} alt="Login Illustration" />
          </div>
          <p className={styles['app-promotion-text']}>
            Stay informed with the latest in technology with <strong>TechTales</strong>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
