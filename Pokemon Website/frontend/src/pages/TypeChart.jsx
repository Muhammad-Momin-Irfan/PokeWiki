import React, { useState } from 'react';
import TypeBadge from '../components/TypeBadge';
import './TypeChart.css';

// Hardcoded Type Effectiveness Data (Simplified for common types)
const typeData = {
  normal: { weak: ['fighting'], immune: ['ghost'] },
  fire: { weak: ['water', 'ground', 'rock'], strong: ['grass', 'ice', 'bug', 'steel'] },
  water: { weak: ['electric', 'grass'], strong: ['fire', 'ground', 'rock'] },
  grass: { weak: ['fire', 'ice', 'poison', 'flying', 'bug'], strong: ['water', 'ground', 'rock'] },
  electric: { weak: ['ground'], strong: ['water', 'flying'] },
  ice: { weak: ['fire', 'fighting', 'rock', 'steel'], strong: ['grass', 'ground', 'flying', 'dragon'] },
  fighting: { weak: ['flying', 'psychic', 'fairy'], strong: ['normal', 'ice', 'rock', 'dark', 'steel'] },
  poison: { weak: ['ground', 'psychic'], strong: ['grass', 'fairy'] },
  ground: { weak: ['water', 'grass', 'ice'], strong: ['fire', 'electric', 'poison', 'rock', 'steel'], immune: ['electric'] },
  flying: { weak: ['electric', 'ice', 'rock'], strong: ['grass', 'fighting', 'bug'], immune: ['ground'] },
  psychic: { weak: ['bug', 'ghost', 'dark'], strong: ['fighting', 'poison'] },
  bug: { weak: ['fire', 'flying', 'rock'], strong: ['grass', 'psychic', 'dark'] },
  rock: { weak: ['water', 'grass', 'fighting', 'ground', 'steel'], strong: ['fire', 'ice', 'flying', 'bug'] },
  ghost: { weak: ['ghost', 'dark'], strong: ['psychic', 'ghost'], immune: ['normal', 'fighting'] },
  dragon: { weak: ['ice', 'dragon', 'fairy'], strong: ['dragon'] },
  dark: { weak: ['fighting', 'bug', 'fairy'], strong: ['psychic', 'ghost'], immune: ['psychic'] },
  steel: { weak: ['fire', 'fighting', 'ground'], strong: ['ice', 'rock', 'fairy'], immune: ['poison'] },
  fairy: { weak: ['poison', 'steel'], strong: ['fighting', 'dragon', 'dark'], immune: ['dragon'] }
};

const TypeChart = () => {
  const [selectedType, setSelectedType] = useState('fire');

  return (
    <div className="chart-page">
      <h1>Type Matchup Analyzer</h1>
      <p>Select a type to see its strengths and weaknesses.</p>

      {/* Selector */}
      <div className="type-selector">
        {Object.keys(typeData).map((type) => (
          <button 
            key={type} 
            className={`type-btn ${selectedType === type ? 'active' : ''}`}
            onClick={() => setSelectedType(type)}
          >
            <TypeBadge type={type} />
          </button>
        ))}
      </div>

      {/* Results Card */}
      <div className="analysis-card">
        <h2>Defense: When you are {selectedType.toUpperCase()}</h2>
        
        <div className="matchup-row">
            <h3>Weak Against (2x Damage):</h3>
            <div className="badges">
                {typeData[selectedType].weak?.map(t => <TypeBadge key={t} type={t} />)}
            </div>
        </div>

        {typeData[selectedType].immune && (
            <div className="matchup-row">
                <h3>Immune To (0x Damage):</h3>
                <div className="badges">
                    {typeData[selectedType].immune.map(t => <TypeBadge key={t} type={t} />)}
                </div>
            </div>
        )}

        <hr />

        <h2>Offense: When you attack with {selectedType.toUpperCase()}</h2>
        <div className="matchup-row">
            <h3>Super Effective Against:</h3>
            <div className="badges">
                {typeData[selectedType].strong?.map(t => <TypeBadge key={t} type={t} />) || <span>None</span>}
            </div>
        </div>
      </div>
    </div>
  );
};

export default TypeChart;