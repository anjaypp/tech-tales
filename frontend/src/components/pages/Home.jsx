import React, { useEffect, useState } from "react";
import { Container, Card, Badge, Image, Button } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import NavigationBar from "../reusable/Navbar";
import styles from "./Home.module.css";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/blog/home")
      .then((res) => {
        setBlogs(res.data);
      })
      .catch((err) => {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs. Please try again later.");
      });
  }, []);

  const handleCategoryChange = (categories) => {
    setSelectedCategory(categories);
  };

  const filteredBlogs = selectedCategory
  ? blogs.filter((blog) => blog.categories.includes(selectedCategory))
  : blogs;


  return (
    <>
    <NavigationBar />
      {error && <div className="alert alert-danger">{error}</div>}
      {/* Sorted section */}
      <div className={styles.sectionone}>
        <Container className={styles.head}>
          <h1 className={styles.heading}>Home</h1>
          </Container>

          <Container className="mt-4">
            <div className= {styles.buttonContainer}>
              <Button className={styles.button} onClick={() => handleCategoryChange(null)}>
                All Categories
              </Button>
              <Button className={styles.button}
                onClick={() => handleCategoryChange("Software Development")}
              >
                Software Development
              </Button>
              <Button className={styles.button} onClick={() => handleCategoryChange("AI & ML")}>
                AI & ML
              </Button>
              <Button className={styles.button} onClick={() => handleCategoryChange("Cybersecurity")}>
                Cybersecurity
              </Button>
              <Button className={styles.button} onClick={() => handleCategoryChange("Data Science")}>
                Data Science
              </Button>
              <Button className={styles.button} onClick={() => handleCategoryChange("Blockchain")}>
                Blockchain
              </Button>
              <Button className={styles.button}
                onClick={() => handleCategoryChange("Gadgets & Consumer Tech")}
              >
                Gadgets & Consumer Tech
              </Button>
            </div>
          </Container>
        

        <Container className="mt-4">
          <div className={styles.cardContainer}>
            {filteredBlogs.map((blog, index) => {

              return (
                <Link
                  to={`/blog/${blog._id}`}
                  key={index}
                  style={{ textDecoration: "none" }}
                >
                  <Card className={styles.card}>
                    <Card.Header className="p-0">
                      <img
                        src={
                          blog.image
                            ? `http://localhost:4000/uploads/${blog.image
                                .split("\\")
                                .pop()}`
                            : "https://via.placeholder.com/400x200?text=No+Image"
                        }
                        alt={blog.title || "Card Header Image"}
                        className={styles.cardHeaderImage}
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover"
                        }}
                        onError={(e) => {
                          console.log("Image failed to load:", e.target.src);
                          e.target.src =
                            "https://via.placeholder.com/400x200?text=No+Image";
                        }}
                      />
                    </Card.Header>
                    <Card.Body className={styles.cardBody}>
                    {blog.categories?.map((category, index) => (
                         <Badge 
                           key={index} 
                            bg="secondary" 
                            className={styles.cardBadge}
                          >
                          {category}
                         </Badge>
                        ))}
                      <Card.Title className={styles.cardTitle}>
                        {blog.title}
                      </Card.Title>
                      <Card.Text className={styles.cardText}>
                        {blog.summary}
                      </Card.Text>
                      <div
                        className={`d-flex align-items-center mt-3 ${styles.user}`}
                      >
                        <Image
                          src={
                            blog.authorAvatar ||
                            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                          } // Fallback if no author image
                          alt="User"
                          roundedCircle
                          className={styles.userImage}
                        />
                        <div className={styles.userInfo}>
                          <h6 className="mb-0">{blog.authorId.username}</h6>
                          <small className={styles.userInfoSmall}>
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Link>
              );
            })}
          </div>
        </Container>
      </div>
    </>
  );
};

export default Home;
