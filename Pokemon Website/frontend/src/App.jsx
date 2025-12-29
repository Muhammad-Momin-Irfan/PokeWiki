import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop'; // <--- 1. IMPORT ADDED HERE

// Import Pages
import Home from './pages/Home';
import Pokedex from './pages/Pokedex';
import PokemonDetails from './pages/PokemonDetails';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TypeChart from './pages/TypeChart'; 
import Abilities from './pages/Abilities'; 


function App() {
  return (
    <div className="app-container">
      {/* <--- 2. COMPONENT ADDED HERE 
          (It's invisible, but it watches the URL and resets scroll) 
      */}
      <ScrollToTop />

      {/* Navbar stays at the top of every page */}
      <Navbar />

      <div className="main-content">
        <Routes>
          {/* --- PUBLIC ROUTES (Anyone can see) --- */}
          <Route path="/" element={<Home />} />
          <Route path="/pokedex" element={<Pokedex />} />
          <Route path="/pokemon/:id" element={<PokemonDetails />} />
          <Route path="/types" element={<TypeChart />} />
          <Route path="/abilities" element={<Abilities />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* --- PROTECTED ROUTES (Only logged-in users) --- */}
          <Route 
            path="/favorites" 
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

export default App;