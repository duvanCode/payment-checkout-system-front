import React from 'react';
import './LoadingOverlay.css';

const LoadingOverlay = () => (
  <div className="loading-overlay">
    <div className="spinner"></div>
    <p className="loading-text">Procesando...</p>
  </div>
);

export default LoadingOverlay;