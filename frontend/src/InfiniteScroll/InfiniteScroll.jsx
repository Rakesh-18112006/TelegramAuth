import React from "react";
import { FaGithub, FaTwitter, FaBook } from "react-icons/fa";
import "./InfiniteScroll.css";


const InfiniteScroll = () => {
  return (
    <div className="infinity-container">
      <img src="logo.png" alt="Logo" className="logo rounded-full" />
      <div className="infinity-text">Loading Devnet</div>

      <div className="social-icons">
        <a href="https://github.com" target="_blank" rel="noopener noreferrer">
          <FaGithub className="icon" />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <FaTwitter className="icon" />
        </a>
        <a href="https://docs.com" target="_blank" rel="noopener noreferrer">
          <FaBook className="icon" />
        </a>
      </div>
    </div>
  );
};

export default InfiniteScroll;
