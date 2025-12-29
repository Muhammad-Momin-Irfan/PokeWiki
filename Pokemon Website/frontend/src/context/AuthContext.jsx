/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- HELPER: Fetch latest teams from Backend ---
  const fetchTeams = async (token) => {
    try {
      const res = await fetch('http://localhost:5000/api/teams', {
        headers: { 'x-auth-token': token }
      });
      const data = await res.json();
      return data; 
    } catch (err) {
      console.error("Error fetching teams:", err);
      return [];
    }
  };

  useEffect(() => {
    const checkLoggedIn = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (storedUser && token) {
        const userData = JSON.parse(storedUser);
        const teams = await fetchTeams(token);
        setUser({ ...userData, teams: teams }); 
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      const teams = await fetchTeams(data.token);
      setUser({ ...data.user, teams: teams });

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser({ ...data.user, teams: [] });

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const createTeam = async (teamName) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/teams', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token 
        },
        body: JSON.stringify({ name: teamName })
      });
      const newTeam = await res.json();
      
      const updatedTeams = [newTeam, ...user.teams];
      setUser({ ...user, teams: updatedTeams });

    } catch (err) {
      console.error(err);
    }
  };

  const deleteTeam = async (teamId) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:5000/api/teams/${teamId}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });

      const updatedTeams = user.teams.filter(t => t._id !== teamId);
      setUser({ ...user, teams: updatedTeams });

    } catch (err) {
      console.error(err);
    }
  };

  // --- NEW FUNCTION: ADD TO TEAM ---
  const addToTeam = async (teamId, memberData) => {
    const token = localStorage.getItem('token');
    
    // 1. Find local team
    const team = user.teams.find(t => t._id === teamId);
    if (!team) return;

    // 2. Create updated member list
    const updatedMembers = [...team.members, memberData];

    try {
        // 3. Save to Backend
        const res = await fetch(`http://localhost:5000/api/teams/${teamId}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify({ members: updatedMembers })
        });
        
        const updatedTeamData = await res.json();

        // 4. Update Global State (Screen updates instantly!)
        const newTeamsList = user.teams.map(t => 
            t._id === teamId ? updatedTeamData : t
        );
        setUser({ ...user, teams: newTeamsList });
        return true; 

    } catch (err) {
        console.error("Add failed", err);
        return false;
    }
  };

  const removeFromTeam = async (teamId, memberId) => {
    const token = localStorage.getItem('token');
    
    // FIX: Allow both _id and id to find the team
    const team = user.teams.find(t => t._id === teamId || t.id === teamId);
    if (!team) {
        console.error("Team not found in context:", teamId);
        return;
    }

    const updatedMembers = team.members.filter(m => m.id !== memberId);

    try {
      const res = await fetch(`http://localhost:5000/api/teams/${team._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ members: updatedMembers })
      });
      
      const updatedTeamData = await res.json();

      const newTeamsList = user.teams.map(t => 
        t._id === team._id ? updatedTeamData : t
      );
      setUser({ ...user, teams: newTeamsList });

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, login, signup, logout, loading, 
      createTeam, deleteTeam, removeFromTeam, addToTeam 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};