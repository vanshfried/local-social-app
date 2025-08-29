import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPosts, fetchCommunities, joinCommunityAPI } from "../process/api";
import { jwtDecode } from "jwt-decode";
import "./Feed.css";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const API_BASE = process.env.REACT_APP_API_BASE_URL;
  const STATIC_BASE = API_BASE.replace("/api", "");

  // Fetch posts and communities
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username || "User");
      } catch {
        localStorage.removeItem("token");
      }
    }

    fetchPosts()
      .then((res) => setPosts(res.data))
      .catch(() => console.log("Error fetching posts"));

    fetchCommunities(token)
      .then((res) => setCommunities(res.data))
      .catch(() => console.log("Error fetching communities"));
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUsername("");
    navigate("/login");
  };

  const joinCommunity = async (communityId) => {
    if (!token) return navigate("/login");

    try {
      const res = await joinCommunityAPI(communityId, token);
      setCommunities((prev) =>
        prev.map((c) =>
          c._id === communityId
            ? { ...c, joined: true, memberCount: res.data.memberCount }
            : c
        )
      );
    } catch (err) {
      console.log("Error joining community");
    }
  };

  return (
    <div className="feed-container">
      <div className="feed-header">
        <h2>Local Social Feed</h2>
      </div>

      {token ? (
        <div className="feed-auth">
          <p>Welcome, <strong>{username}</strong></p>
          <button onClick={handleLogout}>Logout</button>
          <button onClick={() => navigate("/create")}>Create Post</button>
        </div>
      ) : (
        <div className="feed-auth">
          <p>Want to post or comment?</p>
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/signup")}>Sign Up</button>
        </div>
      )}

      {/* Communities Section */}
      <div className="communities-section">
        <h3>Available Communities</h3>
        {communities.length === 0 ? (
          <p>No communities available</p>
        ) : (
          <ul className="community-list">
            {communities.map((comm) => (
              <li key={comm._id}>
                {comm.name} ({comm.memberCount || 0})
                {comm.joined ? (
                  <button disabled>Joined</button>
                ) : (
                  <button onClick={() => joinCommunity(comm._id)}>Join</button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Posts Section */}
      {posts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="post-card">
            <h3>{post.title}</h3>
            <p>{post.content}</p>

            {post.images && post.images.length > 0 && (
              <div className="post-images">
                {post.images.map((img, index) => (
                  <img key={index} src={`${STATIC_BASE}${img}`} alt="post" />
                ))}
              </div>
            )}

            {post.video && (
              <video className="post-video" controls>
                <source src={`${STATIC_BASE}${post.video}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}

            <small className="post-footer">
              By {post.author?.username || "Deleted User"} in {post.community}
            </small>
          </div>
        ))
      )}
    </div>
  );
};

export default Feed;
