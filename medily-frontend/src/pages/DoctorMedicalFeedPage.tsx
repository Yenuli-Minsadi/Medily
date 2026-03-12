import React from "react";
import "../DoctorMedicalFeed.css";

const DoctorMedicalFeed: React.FC = () => {
  return (
    <div className="doctor-dashboard">
      {/* Top Navigation Bar */}
      <nav className="top-navbar">
        <div className="navbar-left">
          <h1 className="navbar-logo">Medily</h1>
        </div>
        <div className="navbar-right">
          <button className="icon-btn" title="Dark Mode">
            <span className="icon">🌙</span>
          </button>
          <button className="icon-btn" title="Notifications">
            <span className="icon">💬</span>
          </button>
          <button className="icon-btn" title="Alerts">
            <span className="icon">🔔</span>
          </button>
          <div className="user-profile">
            <span className="user-name">Dr. Yen</span>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="dashboard-content">
        {/* Sidebar */}
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <a href="#dashboard" className="nav-item">
              Dashboard
            </a>
            <a href="#medical-feed" className="nav-item active">
              Medical Feed
            </a>
            <a href="#appointments" className="nav-item">
              Appointments
            </a>
            <a href="#create-prescription" className="nav-item">
              Create Prescription
            </a>
            <a href="#saved" className="nav-item">
              Saved
            </a>
            <a href="#analytics" className="nav-item">
              Analytics
            </a>
          </nav>
        </aside>

        {/* Main Feed Area */}
        <main className="main-feed">
          {/* Search Bar */}
          <div className="search-container">
            <input type="text" className="search-input" placeholder="Search" />
          </div>

          {/* Feed Header */}
          <div className="feed-header">
            <h2 className="feed-title">Medical Feed</h2>
            <button className="create-post-btn" title="Create Post">
              <span className="plus-icon">+</span>
              <span className="btn-tooltip">Create Post</span>
            </button>
          </div>

          {/* Masonry Grid */}
          <div className="masonry-grid">
            <div className="masonry-item masonry-tall"></div>
            <div className="masonry-item masonry-medium"></div>
            <div className="masonry-item masonry-short"></div>
            <div className="masonry-item masonry-medium"></div>
            <div className="masonry-item masonry-tall"></div>
            <div className="masonry-item masonry-short"></div>
            <div className="masonry-item masonry-medium"></div>
            <div className="masonry-item masonry-tall"></div>
            <div className="masonry-item masonry-short"></div>
            <div className="masonry-item masonry-medium"></div>
            <div className="masonry-item masonry-short"></div>
            <div className="masonry-item masonry-medium"></div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorMedicalFeed;
