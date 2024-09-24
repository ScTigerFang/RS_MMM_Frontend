// HomePage.js
import React from "react";
import '../Styling/HomePage.css';

function HomePage() {
  return (
    <div className="homepage">
      <h1 className="homepage-title">Welcome to My Website</h1>
      <p className="homepage-description">
        This is my homepage where you can find more about me and the projects I’m working on.
      </p>
      <div className="homepage-grid">
        <div className="homepage-card">
          <h2 className="homepage-card-title">RuneScape MMM Project</h2>
          <p>Check out my RuneScape Maximization project for optimized gameplay.</p>
        </div>
        <div className="homepage-card">
          <h2 className="homepage-card-title">Resume</h2>
          <p>View my professional resume and skills in software engineering.</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
