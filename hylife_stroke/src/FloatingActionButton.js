import React from 'react';
import { Link } from 'react-router-dom';
import './FloatingActionButton.css';

const FloatingActionButton = () => {
  return (
    <div className="fab-container">
      <div className="fab-menu">
        <Link to="/" className="fab-menu-button">
          Home
        </Link>
        <Link to="/arm-detection" className="fab-menu-button">
          Arm Detection
        </Link>
      </div>
      <button className="fab-button" type="button">
        <span className="fab-icon">+</span>
      </button>
    </div>
  );
};

export default FloatingActionButton;

