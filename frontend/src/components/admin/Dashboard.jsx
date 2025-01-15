import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Container, Nav, Row, Col, Button } from 'react-bootstrap';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    navigate("/", { replace: true });
  };
  return (
    <Container fluid className="p-4">
      <Row>
        <Col>
          <Nav variant="tabs" defaultActiveKey="/admin/dashboard" className="mb-3">
            <Nav.Item>
              <Nav.Link as={NavLink} to="/admin/dashboard">Dashboard</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={NavLink} to="/admin/blog-management">Blog Management</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={NavLink} to="/create-post">Create Post</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={NavLink} to="/admin/analytics">Analytics</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col md="auto">
          <Button variant="outline-danger" onClick={handleLogout}>
            Logout
          </Button>
        </Col>
      </Row>
      
      <Outlet />
    </Container>
  );
};

export default Dashboard;