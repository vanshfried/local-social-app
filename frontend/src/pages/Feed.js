import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:5000/api/posts")
      .then(res => setPosts(res.data))
      .catch(() => console.log("Error fetching posts"));
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Local Social Feed</h2>
      {!token ? (
        <div>
          <p>Want to post or comment?</p>
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/signup")}>Sign Up</button>
        </div>
      ) : (
        <button onClick={() => navigate("/create")}>Create Post</button>
      )}

      {posts.map((post) => (
        <div key={post._id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <small>By {post.author.username} in {post.community}</small>
        </div>
      ))}
    </div>
  );
};

export default Feed;
