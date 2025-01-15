import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Dropdown from "react-bootstrap/Dropdown";
import { Link, useSearchParams } from "react-router-dom";
import logo from "../../images/Logo.svg";
import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

function NavigationBar() {
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("role");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const queryParam = searchParams.get("query");
    if (queryParam) {
      setSearchTerm(decodeURIComponent(queryParam));
    }
  }, [searchParams]);

  if (role === "admin") return null;

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    navigate("/", { replace: true });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setIsSearching(true);
      try {
        navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    }
  };

  return (
    <Navbar className={styles.navbar} expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/home" className={styles.brand}>
          <img
            alt=""
            src={logo}
            width="60"
            height="60"
            className="d-inline-block align-top"
          />
        </Navbar.Brand>

        {/* Search Form - Available for all users */}
        <Form className={styles.search} onSubmit={handleSearch}>
          <div className="position-relative">
            <Form.Control
              type="search"
              placeholder="Search blog posts ..."
              className={styles.searchInput}
              aria-label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isSearching}
            />
            <Button
              type="submit"
              className={styles.searchButton}
              disabled={isSearching || !searchTerm.trim()}
            >
              {isSearching ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                "Search"
              )}
            </Button>
          </div>
        </Form>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className={styles.nav}>
            {token ? (
              <>
                {/* Authenticated user options */}
                <Nav.Link as={Link} to="/create-post">
                  Create Post
                </Nav.Link>
                <Nav.Link as={Link} to="/notifications">
                  Notifications
                </Nav.Link>
                <Dropdown>
                  <Dropdown.Toggle variant="light" id="dropdown-basic" className={styles.dropdown}>
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      alt="Profile"
                      width="30"
                      height="30"
                      className="d-inline-block align-top"
                    />
                  </Dropdown.Toggle>
                
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => navigate("/profile")}>
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => navigate("/bookmarks")}>
                      Bookmarks
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                {/* Non-authenticated user options */}
                <Button
                  className={`${styles.authButton} me-2`}
                  as={Link}
                  to="/register"
                  variant="outline-primary"
                >
                  Register
                </Button>
                <Button
                  className={styles.authButton}
                  as={Link}
                  to="/"
                  variant="primary"
                >
                  Login
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;