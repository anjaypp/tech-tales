import { Routes, Route,} from "react-router-dom";
import Home from "./components/pages/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import CreatePost from "./components/blog/CreatePost";
import Blogpage from "./components/blog/Blogpage";
import Dashboard from "./components/admin/Dashboard"
import BlogManagement from "./components/admin/pages/blogManagement";
import SearchResults from "./components/pages/SearchResults";
import "./App.css";

function App() {

  return (
    <>
    
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/home" element={<Home />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<Dashboard />}>
          <Route path="dashboard" element={<div>Admin Dashboard Content</div>} />
          <Route path="blog-management" element={<BlogManagement />} />
          <Route path="analytics" element={<div>Analytics Content</div>} />
        </Route>

        {/* Other Routes */}
        <Route path="/blog/:id" element={<Blogpage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="create-post" element={<CreatePost />} />

      </Routes>
    </>
  );
}

export default App;