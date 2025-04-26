import React, { useState } from 'react';
import axios from 'axios';

function EditPostForm({ post, onCancel, onSave }) {
    const [description, setDescription] = useState(post.description);
    const [mediaUrls, setMediaUrls] = useState(post.mediaUrls.join(', '));

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedPost = {
                description,
                mediaUrls: mediaUrls.split(',').map(url => url.trim())
            };
            await axios.put(`http://localhost:9090/api/posts/${post.postId}`, updatedPost);
            alert("Post updated successfully!");
            onSave();
        } catch (error) {
            console.error(error);
            alert("Failed to update post.");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: '10px' }}>
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: '100%', height: '80px', marginBottom: '10px' }}
            />
            <input
                type="text"
                value={mediaUrls}
                onChange={(e) => setMediaUrls(e.target.value)}
                placeholder="Enter media URLs (comma-separated)"
                style={{ width: '100%', marginBottom: '10px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button type="submit" style={{ padding: '5px 10px' }}>Save</button>
                <button type="button" onClick={onCancel} style={{ padding: '5px 10px', backgroundColor: 'grey', color: 'white' }}>Cancel</button>
            </div>
        </form>
    );
}

export default EditPostForm;