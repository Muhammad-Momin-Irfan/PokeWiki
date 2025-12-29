import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer id="about" className="global-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>PokéWiki</h3>
          <p>The ultimate resource for trainers to plan their competitive teams.</p>
        </div>
        
        <div className="footer-section">
          <h4>Tech Stack</h4>
          <ul>
            <li>React & Vite</li>
            <li>Context API</li>
            <li>PokéAPI</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Connect</h4>
          <p>Created by <strong>Trainer Ash</strong></p>
          <p>Web Engineering Project 2025</p>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; 2025 PokéWiki. Data provided by PokéAPI.
      </div>
    </footer>
  );
};

export default Footer;