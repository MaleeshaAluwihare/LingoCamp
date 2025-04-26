import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditPostForm from './EditPostForm';

function PostList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingPostId, setEditingPostId] = useState(null);

    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://localhost:9090/api/posts/all');
            setPosts(response.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            alert("Failed to fetch posts.");
        }
    };

    const deletePost = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            await axios.delete(`http://localhost:9090/api/posts/${postId}`);
            alert("Post deleted!");
            fetchPosts();
        } catch (error) {
            console.error(error);
            alert("Failed to delete post.");
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    if (loading) return <p>Loading posts...</p>;

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: '20px' }}>
            {posts.map(post => (
                <div key={post.postId} style={{ border: '1px solid #ccc', borderRadius: '10px', width: '250px', margin: '10px', padding: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
    
                {editingPostId === post.postId ? (
                    <EditPostForm
                        post={post}
                        onCancel={() => setEditingPostId(null)}
                        onSave={() => {
                            setEditingPostId(null);
                            fetchPosts(); 
                        }}
                    />
                ) : (

                    <>
                        {post.mediaUrls && Array.isArray(post.mediaUrls) && post.mediaUrls.length > 0 && (
                            <img 
                                src={post.mediaUrls[0]} 
                                alt="Post Media" 
                                style={{
                                    width: '100%',
                                    height: '150px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    marginBottom: '10px'
                                }}
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        )}
                        <p style={{ marginTop: '10px' }}>{post.description}</p>
                        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                            <button 
                                onClick={() => setEditingPostId(post.postId)} 
                                style={{ padding: '5px 10px' }}
                            >
                                Edit
                            </button>
                            <button 
                                onClick={() => deletePost(post.postId)} 
                                style={{ padding: '5px 10px', backgroundColor: 'red', color: 'white' }}
                            >
                                Delete
                            </button>
                        </div>
                    </>
                )}
            </div>
            ))}
        </div>
    );
}

export default PostList;
