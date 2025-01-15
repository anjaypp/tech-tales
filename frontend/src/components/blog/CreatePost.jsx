import React, { useState, useEffect, useRef } from 'react';
import { Form, Button } from 'react-bootstrap';
import 'quill/dist/quill.snow.css';
import styles from './CreatePost.module.css';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../reusable/Navbar';
import Quill from 'quill';
import axios from 'axios';

function CreatePost() {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [categories, setCategories] = useState('');  // Change to a string for single selection
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const editorRef = useRef(null);
    const quillInstance = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (editorRef.current && !quillInstance.current) {
            quillInstance.current = new Quill(editorRef.current, {
                theme: 'snow',
                placeholder: 'Write your post content here...',
                modules: {
                    toolbar: [
                        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                        [{ 'size': [] }],
                        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' },
                         { 'indent': '-1' }, { 'indent': '+1' }],
                        ['link', 'image', 'video'],
                        ['clean']
                    ]
                }
            });
            quillInstance.current.on('text-change', () => {
                setContent(quillInstance.current.root.innerHTML);
            });
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('image', image);
        formData.append('summary', summary);
        formData.append('categories', categories);  // Single category
        formData.append('content', content);
        formData.append('tags', tags);

        try {
            const response = await axios.post("http://localhost:4000/api/blog/add", formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setSuccess('Post created successfully!');
            setTitle('');
            setImage(null);
            setSummary('');
            setCategories('');  // Reset single category
            setContent('');
            setTags('');
            quillInstance.current.setContents([]);
            if (response.status === 201) {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating post');
        }
    };

    return (
        <>
        <NavigationBar />
        <div className={styles.createpost}>
            <h2>Create a New Post</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="postTitle" className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter post title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="postImage" className="mb-3">
                    <Form.Label>Upload Image</Form.Label>
                    <Form.Control
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                        accept="image/*"
                    />
                </Form.Group>

                <Form.Group controlId="postSummary" className="mb-3">
                    <Form.Label>Summary</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter post summary"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                    />
                </Form.Group>

                <Form.Group controlId="postCategory" className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                        value={categories}
                        onChange={(e) => setCategories(e.target.value)}
                        required
                    >
                        <option value="">Select a category</option>
                        <option value="Software Development">Software Development</option>
                        <option value="AI & ML">AI & ML</option>
                        <option value="Cybersecurity">Cybersecurity</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Blockchain">Blockchain</option>
                        <option value="Gadgets & Consumer Tech">Gadgets & Consumer Tech</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group controlId="postContent" className="mb-3">
                    <Form.Label>Content</Form.Label>
                    <div ref={editorRef} style={{ height: '300px', marginBottom: '50px' }} />
                </Form.Group>

                <Form.Group controlId="postTags" className="mb-3">
                    <Form.Label>Tags</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter tags, separated by commas"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                    />
                </Form.Group>

                <Button variant="primary" type="submit" onClick={handleSubmit}>
                    Create Post
                </Button>
            </Form>
        </div>
        </>
    );
}

export default CreatePost;
