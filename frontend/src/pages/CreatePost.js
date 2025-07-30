import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./CreatePost.css";
import { createPost } from "../process/api";

const MAX_TITLE_LENGTH = 50;
const MAX_CONTENT_LENGTH = 3000;
const MIN_CONTENT_LENGTH = 50;

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
    formData.append("title", title.replace(/\s+/g, " ").trim());
    formData.append("content", content.replace(/\s+/g, " ").trim());
    if (video) formData.append("video", video);
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    try {
      await createPost(formData, token);

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
          {/* Title */}
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

          {/* Content */}
          <div className="textarea-wrapper">
            <textarea
              ref={textareaRef}
              placeholder="Text (optional)"
              maxLength={MAX_CONTENT_LENGTH}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="reddit-textarea"
              onInput={handleTextareaInput}
            />
            <span
              className={`char-counter ${
                content.length > MAX_CONTENT_LENGTH - 250 ||
                content.length < MIN_CONTENT_LENGTH
                  ? "warning"
                  : ""
              }`}
            >
              {content.length}/{MAX_CONTENT_LENGTH}
            </span>
            {content.trim().length < MIN_CONTENT_LENGTH && (
              <span className="error-message">
                Content must be at least {MIN_CONTENT_LENGTH} characters.
              </span>
            )}
          </div>

          {/* Media */}
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

          {/* Actions */}
          <div className="reddit-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="post-btn"
              disabled={
                !title.trim() || content.trim().length < MIN_CONTENT_LENGTH
              }
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
