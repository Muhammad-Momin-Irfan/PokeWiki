import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { getPokemonDetails, getAbilityDetails, getItemDetails } from '../services/pokeApi';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import TypeBadge from '../components/TypeBadge';
import './PokemonDetails.css';

// API Setup
const api = axios.create({
  baseURL: 'http://localhost:5000/api', 
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers['x-auth-token'] = token;
  return config;
});

const PokemonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // FIX #1: We brought back 'addToTeam' so we can update the global state instantly
  const { user, addToTeam } = useContext(AuthContext); 
  
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- MODAL STATE ---
  const [showModal, setShowModal] = useState(false);
  const [userTeams, setUserTeams] = useState([]); 
  const [selectedTeamId, setSelectedTeamId] = useState('');
  
  // Ability & Item State
  const [selectedAbility, setSelectedAbility] = useState('');
  const [abilityDesc, setAbilityDesc] = useState('');
  const [itemSearch, setItemSearch] = useState('');
  const [foundItem, setFoundItem] = useState(null); 
  const [isSearchingItem, setIsSearchingItem] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getPokemonDetails(id);
        setPokemon(data);
        
        if (data.abilities.length > 0) {
          const firstAbility = data.abilities[0].ability.name;
          setSelectedAbility(firstAbility);
          const desc = await getAbilityDetails(firstAbility);
          setAbilityDesc(desc);
        }
      } catch (error) {
        console.error("Failed to load Pokemon:", error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, navigate]);

  const handleOpenModal = async () => {
    if (!user) {
      alert("Please login to build your team!");
      navigate('/login');
      return;
    }

    try {
      // Fetch latest teams to ensure dropdown is fresh
      const res = await api.get('/teams');
      const teams = res.data;

      if (teams.length === 0) {
        alert("You have no teams! Go to 'My Team' to create one first.");
        return;
      }

      setUserTeams(teams);
      setSelectedTeamId(teams[0]._id); 
      setShowModal(true);

    } catch (err) {
      console.error("Error fetching teams", err);
      alert("Could not load your teams. Server error?");
    }
  };

  const handleAbilityChange = async (e) => {
    const newAbility = e.target.value;
    setSelectedAbility(newAbility);
    setAbilityDesc("Loading description...");
    const desc = await getAbilityDetails(newAbility);
    setAbilityDesc(desc);
  };

  const handleItemSearch = async () => {
    if (!itemSearch.trim()) {
      setFoundItem(null);
      return;
    }
    setIsSearchingItem(true);
    const itemData = await getItemDetails(itemSearch);
    setFoundItem(itemData); 
    setIsSearchingItem(false);
  };

  const handleConfirmAdd = async () => {
    // 1. Prepare the Member Object (Matches your Schema names exactly)
    const newMember = {
      id: pokemon.id,
      name: pokemon.name,
      image: pokemon.image,        
      types: pokemon.types.map(t => t.type.name),
      stats: pokemon.stats.map(s => ({ name: s.stat.name, value: s.base_stat })),
      selectedAbility: selectedAbility, 
      heldItem: foundItem ? foundItem.name : 'None', 
      moves: [] 
    };

    // FIX #2: Use the Context function instead of manual API calls
    // This updates the Database AND the Screen instantly!
    const success = await addToTeam(selectedTeamId, newMember);

    if (success) {
        setShowModal(false);
        alert(`${pokemon.name} added successfully!`);
    } else {
        alert("Failed to add to team (Is it full?).");
    }
  };

  if (loading) return <Loader />;
  if (!pokemon) return null;

  return (
    <div className="details-container">
      {/* LEFT COLUMN: Image & Actions */}
      <div className="details-card">
        <div className="details-header">
            <h1>{pokemon.name}</h1>
            <span className="details-id">#{String(pokemon.id).padStart(3, '0')}</span>
        </div>
        
        <div className="details-img-container">
            <img src={pokemon.image} alt={pokemon.name} />
        </div>
        
        <div className="details-types">
            {pokemon.types.map((t) => <TypeBadge key={t.type.name} type={t.type.name} />)}
        </div>

        {/* The Action Button */}
        <button className="btn-add-team" onClick={handleOpenModal}>
            {user ? "Add to My Team" : "Login to Capture"}
        </button>
      </div>

      {/* RIGHT COLUMN: Stats & Info */}
      <div className="details-info">
        <h3>Pokedex Entry</h3>
        <p className="description">{pokemon.description}</p>
        
        {/* Info Grid with Abilities */}
        <div className="info-grid">
            <div className="info-item">
                <strong>Height</strong>
                <p>{pokemon.height / 10} m</p>
            </div>
            <div className="info-item">
                <strong>Weight</strong>
                <p>{pokemon.weight / 10} kg</p>
            </div>
            <div className="info-item full-width">
                <strong>Abilities</strong>
                <div className="ability-tags">
                   {pokemon.abilities.map(a => (
                     <span key={a.ability.name} className="ability-tag">
                       {a.ability.name}
                     </span>
                   ))}
                </div>
            </div>
        </div>

        <h3>Base Stats</h3>
        <div className="stats-container">
            {pokemon.stats.map((stat) => (
                <div key={stat.stat.name} className="stat-row">
                    <span className="stat-name">{stat.stat.name}</span>
                    <div className="progress-bar-bg">
                        <div 
                           className="progress-bar-fill" 
                           style={{ width: `${Math.min(stat.base_stat, 100)}%` }}
                        ></div>
                    </div>
                    <span className="stat-value">{stat.base_stat}</span>
                </div>
            ))}
        </div>
      </div>

      {/* --- MODAL OVERLAY --- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add to Team</h3>
            
            {/* 1. TEAM SELECTION */}
            <div className="modal-group">
              <label>Select Team:</label>
              <select value={selectedTeamId} onChange={(e) => setSelectedTeamId(e.target.value)}>
                {userTeams.map(team => (
                  <option key={team._id} value={team._id}>
                    {team.name} ({team.members ? team.members.length : 0}/6)
                  </option>
                ))}
              </select>
            </div>

            {/* 2. ABILITY SELECTION */}
            <div className="modal-group">
              <label>Ability:</label>
              <select value={selectedAbility} onChange={handleAbilityChange}>
                {pokemon.abilities.map(a => (
                  <option key={a.ability.name} value={a.ability.name}>{a.ability.name}</option>
                ))}
              </select>
              <p className="info-text-small">{abilityDesc}</p>
            </div>

            {/* 3. ITEM SEARCH */}
            <div className="modal-group">
              <label>Held Item (Search):</label>
              <div className="item-search-box">
                <input 
                  type="text" 
                  placeholder="e.g. Leftovers" 
                  value={itemSearch}
                  onChange={(e) => setItemSearch(e.target.value)}
                  onBlur={handleItemSearch} 
                  onKeyDown={(e) => e.key === 'Enter' && handleItemSearch()} 
                />
                <button type="button" onClick={handleItemSearch}>🔍</button>
              </div>
              
              {foundItem ? (
                <div className="item-result">
                  <img src={foundItem.sprite} alt={foundItem.name} />
                  <div>
                    <strong>{foundItem.name}</strong>
                    <p>{foundItem.effect}</p>
                  </div>
                </div>
              ) : itemSearch && !isSearchingItem ? (
                <p className="error-text">Item not found (Try 'Leftovers')</p>
              ) : null}
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-confirm" onClick={handleConfirmAdd}>Add Pokemon</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonDetails;