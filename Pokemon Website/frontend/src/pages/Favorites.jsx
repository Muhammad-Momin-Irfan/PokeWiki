import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaPlus, FaTrash } from 'react-icons/fa';
import TypeBadge from '../components/TypeBadge';
import './Favorites.css';

const Favorites = () => {
  const { user, createTeam, deleteTeam, removeFromTeam } = useContext(AuthContext);
  const [newTeamName, setNewTeamName] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    createTeam(newTeamName);
    setNewTeamName('');
  };

  if (!user) {
    return (
      <div className="favorites-empty">
        <h2>Please Login</h2>
        <Link to="/login" className="btn-action">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1>My Teams</h1>
        <p>Manage your battle lineups. (Max 6 Pokémon per team)</p>
        
        {/* Create Team Input */}
        <form onSubmit={handleCreate} className="create-team-form">
          <input 
            type="text" 
            placeholder="New Team Name (e.g., 'Gym Battles')" 
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            maxLength={25}
          />
          <button type="submit"><FaPlus /> Create</button>
        </form>
      </div>

      <div className="teams-container">
        {user.teams.length === 0 ? (
          <div className="empty-state">
            <h3>No teams yet!</h3>
            <p>Create a team above to get started.</p>
          </div>
        ) : (
          user.teams.map((team) => (
            /* FIX #1: Use team._id for the unique key */
            <div key={team._id} className="team-card">
              <div className="team-header">
                <h3>{team.name}</h3>
                <div className="team-actions">
                    <span className="team-count">{team.members.length} / 6</span>
                    <button 
                      className="btn-delete-team" 
                      onClick={() => {
                        /* FIX #2: Use team._id to delete the team */
                        if(window.confirm('Delete this entire team?')) deleteTeam(team._id)
                      }}
                      title="Delete Team"
                    >
                      <FaTrash />
                    </button>
                </div>
              </div>

              {/* The 6 Slots Grid */}
              <div className="team-slots">
                {/* 1. Render actual members */}
                {team.members.map((member) => (
                  <div key={member.id} className="slot filled">
                    
                    {/* Remove Button (X) */}
                    <button 
                        className="btn-remove-member"
                        /* FIX #3: Use team._id to find the team, and member.id to find the Pokemon */
                        onClick={() => removeFromTeam(team._id, member.id)}
                    >
                        ×
                    </button>

                    <img src={member.image} alt={member.name} className="slot-img" />
                    
                    <div className="slot-info">
                        <span className="slot-name">{member.name}</span>
                        {/* Show Item & Ability */}
                        <div className="slot-details">
                            <span className="detail-tag item">
                                👜 {member.heldItem === 'None' ? '-' : member.heldItem}
                            </span>
                            <span className="detail-tag ability">
                                ✨ {member.selectedAbility}
                            </span>
                        </div>
                    </div>
                  </div>
                ))}

                {/* 2. Render empty slots to always show 6 boxes */}
                {[...Array(6 - team.members.length)].map((_, index) => (
                  <div key={`empty-${index}`} className="slot empty">
                    <span>+</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Favorites;