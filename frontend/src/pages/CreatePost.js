import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CreatePost.css";

const MAX_TITLE_LENGTH = 300;

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const textareaRef = useRef(null);

  const handleTextareaInput = () => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 250)}px`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (video) formData.append("video", video);
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    try {
      await axios.post("http://localhost:5000/api/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/");
    } catch (err) {
      alert("You must be logged in to post");
    }
  };

  return (
    <div className="reddit-container">
      <div className="reddit-card">
        <h3>Create a post</h3>
        <form onSubmit={handleSubmit}>
          <div className="title-wrapper">
            <input
              type="text"
              placeholder="Title"
              value={title}
              maxLength={MAX_TITLE_LENGTH}
              onChange={(e) => setTitle(e.target.value)}
              className="reddit-title"
              required
            />
            <span
              className={`char-counter ${
                title.length > MAX_TITLE_LENGTH - 20 ? "warning" : ""
              }`}
            >
              {title.length}/{MAX_TITLE_LENGTH}
            </span>
          </div>

          <textarea
            ref={textareaRef}
            placeholder="Text (optional)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="reddit-textarea"
            onInput={handleTextareaInput}
          />

          <div className="reddit-media">
            <label className="media-btn">
              Add Images
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImages(e.target.files)}
                hidden
              />
            </label>
            <label className="media-btn">
              Add Video
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setVideo(e.target.files[0])}
                hidden
              />
            </label>
          </div>

          <div className="reddit-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
            <button type="submit" className="post-btn">
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
