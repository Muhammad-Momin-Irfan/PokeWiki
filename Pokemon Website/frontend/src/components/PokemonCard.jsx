import React from 'react';
import { Link } from 'react-router-dom';
import './PokemonCard.css';

const PokemonCard = ({ pokemon }) => {
  // Guard clause: If data is missing (loading), don't crash
  if (!pokemon) return null;

  return (
    <div className="pokemon-card">
      {/* Image Container */}
      <div className="card-img-container">
        <img 
            src={pokemon.sprites?.front_default || 'https://via.placeholder.com/120'} 
            alt={pokemon.name} 
            className="card-img"
        />
      </div>

      {/* Info Container */}
      <div className="card-info">
        <span className="card-id">#{String(pokemon.id).padStart(3, '0')}</span>
        <h3 className="card-name">{pokemon.name}</h3>
        
        {/* Types Badges */}
        <div className="card-types">
            {pokemon.types?.map((t) => (
                <span key={t.type.name} className={`type-badge ${t.type.name}`}>
                    {t.type.name}
                </span>
            ))}
        </div>
        
        {/* Link to Details Page */}
        <Link to={`/pokemon/${pokemon.id}`} className="btn-details">
            View Details
        </Link>
      </div>
    </div>
  );
};

export default PokemonCard;