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

          {/* Display Images */}
          {post.images && post.images.length > 0 && (
            <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
              {post.images.map((img, index) => (
                <img 
                  key={index} 
                  src={`http://localhost:5000${img}`} 
                  alt="post" 
                  style={{ maxWidth: "200px", borderRadius: "5px" }}
                />
              ))}
            </div>
          )}

          {/* Display Video */}
          {post.video && (
            <video width="320" height="240" controls style={{ marginTop: "10px" }}>
              <source src={`http://localhost:5000${post.video}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}

          <small style={{ display: "block", marginTop: "10px" }}>
            By {post.author.username} in {post.community}
          </small>
        </div>
      ))}
    </div>
  );
};

export default Feed;
