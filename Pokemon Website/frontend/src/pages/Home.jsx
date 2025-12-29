import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPokemonList } from '../services/pokeApi';
import PokemonCard from '../components/PokemonCard';
import Loader from '../components/Loader';
import SearchBar from '../components/SearchBar';
import './Home.css'; // We will create this next

const Home = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0); // Tracks where to start fetching next
  const navigate = useNavigate();

  // 1. Fetch Data Function
  const fetchPokemon = async (currentOffset) => {
    try {
      setLoading(true);
      const newPokemon = await getPokemonList(20, currentOffset);
      
      // Append new data to the existing list (for "Load More" functionality)
      setPokemonList((prev) => [...prev, ...newPokemon]); 
    } catch (error) {
      console.error("Failed to load pokemon:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Initial Load
  useEffect(() => {
    fetchPokemon(0);
  }, []);

  // 3. Handle "Load More" Button
  const handleLoadMore = () => {
    const newOffset = offset + 20;
    setOffset(newOffset);
    fetchPokemon(newOffset);
  };

  // 4. Handle Search (Direct navigation)
  const handleSearch = (query) => {
    if (query.trim()) {
      // Navigate to details page directly (e.g., /pokemon/pikachu)
      navigate(`/pokemon/${query.toLowerCase()}`);
    }
  };

  return (
    <div className="home-page">
      <div className="home-header">
        <h1>Welcome to PokéWiki</h1>
        <p>Discover, analyze, and build your dream team.</p>
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Show Loader only on initial load, not on "Load More" */}
      {loading && pokemonList.length === 0 ? (
        <Loader />
      ) : (
        <>
          <div className="pokemon-grid">
            {pokemonList.map((poke) => (
              <PokemonCard key={poke.id} pokemon={poke} />
            ))}
          </div>

          <div className="pagination-container">
            <button 
                onClick={handleLoadMore} 
                className="btn-load-more" 
                disabled={loading}
            >
              {loading ? 'Loading...' : 'Load More Pokémon'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;