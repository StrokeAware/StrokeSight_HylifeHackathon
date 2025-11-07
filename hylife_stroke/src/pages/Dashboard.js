import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <h2>StrokeSight</h2>
            </Link>
          </div>
          <ul className="nav-menu">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
          </ul>
        </div>
      </nav>

      <div className="dashboard-container">
        <h1>Dashboard</h1>
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Real-Time Monitoring</h3>
            <p>Monitor patient vitals and stroke indicators in real-time</p>
            <button className="btn btn-primary">View Monitoring</button>
          </div>
          <div className="dashboard-card">
            <h3>Patient Records</h3>
            <p>Access and manage patient information and medical history</p>
            <button className="btn btn-primary">View Patients</button>
          </div>
          <div className="dashboard-card">
            <h3>Alerts & Notifications</h3>
            <p>View recent alerts and critical notifications</p>
            <button className="btn btn-primary">View Alerts</button>
          </div>
          <div className="dashboard-card">
            <h3>Analytics</h3>
            <p>View comprehensive analytics and reports</p>
            <button className="btn btn-primary">View Analytics</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

