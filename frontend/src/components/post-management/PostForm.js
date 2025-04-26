import React, { useState } from 'react';
import axios from 'axios';

function PostForm({ refreshPosts }) {
    const [description, setDescription] = useState('');
    const [mediaUrls, setMediaUrls] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const mediaUrlArray = mediaUrls.split(',').map(url => url.trim());
            await axios.post('http://localhost:9090/api/posts/create', {
                userId: "learner123",
                description,
                mediaUrls: mediaUrlArray,
                timestamp: Date.now()
            });
            alert("Post created successfully!");
            setDescription('');
            setMediaUrls('');
        } catch (error) {
            console.error(error);
            alert("Failed to create post.");
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '30px auto' }}>
            <h2>Create Post</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    placeholder="Enter description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ width: '100%', height: '80px', marginBottom: '10px' }}
                />
                <input
                    type="text"
                    placeholder="Enter media URLs (comma-separated)..."
                    value={mediaUrls}
                    onChange={(e) => setMediaUrls(e.target.value)}
                    style={{ width: '100%', marginBottom: '10px' }}
                />
                <button type="submit" style={{ padding: '10px 20px' }}>Post</button>
            </form>
        </div>
    );
}

export default PostForm;
