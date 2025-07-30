import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPosts } from "../process/api";
import { jwtDecode } from "jwt-decode";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username || "User");
        console.log(decoded);
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem("token");
      }
    }

    fetchPosts()
      .then(res => setPosts(res.data))
      .catch(() => console.log("Error fetching posts"));
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUsername("");
    navigate("/login");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Local Social Feed</h2>

      {token ? (
        <div>
          <p>Welcome, <strong>{username}</strong></p>
          <button onClick={handleLogout}>Logout</button>
          <button onClick={() => navigate("/create")} style={{ marginLeft: "10px" }}>
            Create Post
          </button>
        </div>
      ) : (
        <div>
          <p>Want to post or comment?</p>
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/signup")}>Sign Up</button>
        </div>
      )}

      {/* Posts */}
      {posts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        posts.map((post) => (
          <div 
            key={post._id} 
            style={{ 
              border: "1px solid #ccc", 
              padding: "10px", 
              margin: "10px",
              borderRadius: "6px"
            }}
          >
            <h3>{post.title}</h3>
            <p>{post.content}</p>

            {/* Images */}
            {post.images && post.images.length > 0 && (
              <div 
                style={{ 
                  display: "flex", 
                  justifyContent: "center", 
                  gap: "10px", 
                  flexWrap: "wrap" 
                }}
              >
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

            {/* Video */}
            {post.video && (
              <video 
                width="320" 
                height="240" 
                controls 
                style={{ marginTop: "10px" }}
              >
                <source src={`http://localhost:5000${post.video}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}

            {/* Author */}
            <small style={{ display: "block", marginTop: "10px" }}>
              By {post.author?.username || "Deleted User"} in {post.community}
            </small>
          </div>
        ))
      )}
    </div>
  );
};

export default Feed;
