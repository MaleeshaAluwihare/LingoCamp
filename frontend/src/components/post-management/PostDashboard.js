import React from 'react';
import PostForm from './PostForm';
import PostList from './PostList';

function PostDashboard() {
    return (
        <div>
            <h1 style={{textAlign:"center", marginTop:"20px"}}>Post Management</h1>
            <PostForm />
            <PostList />
        </div>
    );
}

export default PostDashboard;