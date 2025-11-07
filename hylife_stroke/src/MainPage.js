import React from 'react';
import './MainPage.css';
import { Link } from 'react-router-dom';

const MainPage = () => {
  return (
    <div className="main-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <img src="/StrokeSight.ico" alt="StrokeSight Logo" className="logo-image" />
            <h2>StrokeSight</h2>
          </div>
          <ul className="nav-menu">
            <li><a href="#home">Home</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-content">
          
          <h1 className="hero-title">StrokeSight</h1>
          <p className="hero-subtitle thai-text">แพลตฟอร์มคัดกรองโรคหลอดเลือดสมองด้วยปัญญาประดิษฐ์</p>
          <p className="hero-description">
            Empowering healthcare professionals with real-time stroke detection and monitoring capabilities
            to save lives and improve patient outcomes.
          </p>
          <div className="hero-buttons">
            <Link to="/history  " className="btn btn-primary go-to-speech-btn">Go History</Link>
            <Link to="/speech  " className="btn btn-primary go-to-speech-btn">Go Speech</Link>
            <button className="btn btn-secondary">Learn More</button>
          </div>
        </div>
        <div className="hero-image">
          <div className="placeholder-image">
            <img src="/StrokeSight.ico" alt="StrokeSight Logo" className="hero-logo-right" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <h2 className="section-title">Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h3>Real-Time Monitoring</h3>
              <p>Continuous monitoring of vital signs and stroke indicators with instant alerts</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                  <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
              </div>
              <h3>AI-Powered Detection</h3>
              <p>Advanced machine learning algorithms for accurate stroke detection and risk assessment</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3>Patient Management</h3>
              <p>Comprehensive patient records and history tracking for better care coordination</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <h3>Emergency Alerts</h3>
              <p>Instant notifications to healthcare providers when critical conditions are detected</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="20" x2="12" y2="10"/>
                  <line x1="18" y1="20" x2="18" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="16"/>
                </svg>
              </div>
              <h3>Data Analytics</h3>
              <p>Comprehensive analytics and reporting for data-driven healthcare decisions</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <h3>Secure & Private</h3>
              <p>HIPAA-compliant security measures to protect patient data and privacy</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="container">
          <h2 className="section-title">About StrokeSight</h2>
          <div className="about-content">
            <p className="about-text">
              StrokeSight is a cutting-edge healthcare technology platform designed to revolutionize
              stroke detection and monitoring. Our system leverages advanced AI and real-time monitoring
              to provide healthcare professionals with the tools they need to detect strokes early and
              provide timely intervention.
            </p>
            <p className="about-text">
              Developed for the Hylife Hackathon 2025, StrokeSight combines medical expertise with
              innovative technology to improve patient outcomes and save lives. Our mission is to make
              stroke detection faster, more accurate, and more accessible to healthcare providers worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="container">
          <h2 className="section-title">Get In Touch</h2>
          <div className="contact-content">
            <p>Have questions or want to learn more about StrokeSight?</p>
            <button className="btn btn-primary">Contact Us</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 StrokeSight. All rights reserved. | Hylife Hackathon 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default MainPage;

