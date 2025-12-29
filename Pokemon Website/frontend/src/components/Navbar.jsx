import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSun, FaMoon, FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  // 1. Get User Data from Global State
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Ref for scroll tracking
  const lastScrollY = useRef(0); 

  // --- Dark Mode Logic ---
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  // --- Hide Navbar on Scroll Logic ---
  const controlNavbar = () => {
    if (typeof window !== 'undefined') {
      const currentScrollY = window.scrollY;
      
      // Hide if scrolling down AND moved more than 100px
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollY.current = currentScrollY;
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, []);

  // --- Smooth Scroll for "About" link ---
  const handleScroll = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  // --- Logout Logic ---
  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`navbar ${showNavbar ? 'nav-visible' : 'nav-hidden'}`}>
      <div className="navbar-container">
        
        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/">PokéWiki</Link>
        </div>

        {/* Mobile Menu Icon */}
        <div className="menu-icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Links */}
        <ul className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/pokedex" className="nav-links" onClick={() => setIsMobileMenuOpen(false)}>Pokedex</Link>
          </li>
          
          {/* --- NEW LINKS --- */}
          <li className="nav-item">
            <Link to="/types" className="nav-links" onClick={() => setIsMobileMenuOpen(false)}>Type Chart</Link>
          </li>
          <li className="nav-item">
            <Link to="/abilities" className="nav-links" onClick={() => setIsMobileMenuOpen(false)}>Abilities</Link>
          </li>
          {/* ----------------- */}

          {/* Conditionally show "My Team" only if logged in */}
          {user && (
            <li className="nav-item">
              <Link to="/favorites" className="nav-links" onClick={() => setIsMobileMenuOpen(false)}>My Team</Link>
            </li>
          )}

          <li className="nav-item">
            <a href="/about" className="nav-links" onClick={(e) => handleScroll(e, 'about')}>About</a>
          </li>
          
          {/* Theme Toggle Button */}
          <li className="nav-item theme-toggle" onClick={toggleTheme}>
            {isDarkMode ? <FaSun className="icon-sun" /> : <FaMoon className="icon-moon" />}
          </li>

          
          {user ? (
            // IF LOGGED IN: Show Name + Logout Button
            <>
              <li className="nav-item user-greeting">
                <FaUserCircle /> <span>{user.name}</span>
              </li>
              <li className="nav-item">
                 <button 
                    onClick={handleLogout} 
                    className="nav-links-btn logout-btn"
                 >
                    Logout
                 </button>
              </li>
            </>
          ) : (
            // IF LOGGED OUT: Show Login Button
            <li className="nav-item">
               <Link to="/login" className="nav-links-btn" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;