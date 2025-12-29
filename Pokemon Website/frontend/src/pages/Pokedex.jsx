import React, { useState, useEffect } from 'react';
import { getPokemonList, getPokemonByType } from '../services/pokeApi';
import PokemonCard from '../components/PokemonCard';
import Loader from '../components/Loader';
import './Pokedex.css';

const types = [
  'all', 'grass', 'fire', 'water', 'bug', 'normal', 
  'poison', 'electric', 'ground', 'fairy', 'fighting', 
  'psychic', 'rock', 'ghost', 'ice', 'dragon', 'dark', 'steel', 'flying'
];

const Pokedex = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // If 'all', we fetch standard list. If specific type, we use the new function.
        let data;
        if (selectedType === 'all') {
          data = await getPokemonList(50, 0); // Fetch top 50 for 'all'
        } else {
          data = await getPokemonByType(selectedType);
        }
        setPokemonList(data);
      } catch (error) {
        console.error("Error fetching pokedex:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedType]); // Re-run whenever selectedType changes

  return (
    <div className="pokedex-page">
      <div className="pokedex-header">
        <h1>National Pokédex</h1>
        <p>Filter Pokémon by their primary element.</p>
        
        {/* Horizontal Type Scroller */}
        <div className="type-filter-container">
          {types.map((type) => (
            <button
              key={type}
              className={`filter-btn ${type} ${selectedType === type ? 'active' : ''}`}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="pokemon-grid">
          {pokemonList.map((poke) => (
            <PokemonCard key={poke.id} pokemon={poke} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Pokedex;