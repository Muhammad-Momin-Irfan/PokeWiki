import React, { useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';
import './Abilities.css';

const Abilities = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [abilityData, setAbilityData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    setLoading(true);
    setError('');
    setAbilityData(null);

    try {
      const formatted = searchTerm.toLowerCase().replace(/ /g, '-');
      const res = await axios.get(`https://pokeapi.co/api/v2/ability/${formatted}`);
      
      const engEntry = res.data.effect_entries.find(e => e.language.name === 'en');
      
      setAbilityData({
        name: res.data.name,
        effect: engEntry ? engEntry.effect : 'No detailed description available.',
        pokemon: res.data.pokemon.map(p => p.pokemon.name) // List of pokemon having it
      });
    } catch (err) {
      console.error(err); // <--- FIX: This uses the 'err' variable so ESLint stops complaining
      setError("Ability not found. Try 'Overgrow', 'Static', or 'Intimidate'.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="abilities-page">
      <h1>Ability Encyclopedia</h1>
      <p>Search for an ability to learn its combat effect.</p>

      <form onSubmit={handleSearch} className="ability-search">
        <input 
          type="text" 
          placeholder="e.g. Levitate" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <Loader />}
      {error && <p className="error-msg">{error}</p>}

      {abilityData && (
        <div className="ability-card">
          <h2>{abilityData.name}</h2>
          <div className="ability-effect">
            <strong>Effect:</strong>
            <p>{abilityData.effect}</p>
          </div>
          
          <div className="ability-users">
            <strong>Pokémon with this ability:</strong>
            <div className="user-list">
                {abilityData.pokemon.slice(0, 10).map(p => (
                    <span key={p} className="poke-chip">{p}</span>
                ))}
                {abilityData.pokemon.length > 10 && <span>...and {abilityData.pokemon.length - 10} more</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Abilities;