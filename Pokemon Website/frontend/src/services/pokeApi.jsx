import axios from 'axios';

const BASE_URL = 'https://pokeapi.co/api/v2';

// 1. Get a list of Pokemon (for the Home page)
export const getPokemonList = async (limit = 20, offset = 0) => {
  try {
    const response = await axios.get(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
    
    const promises = response.data.results.map(async (pokemon) => {
      const details = await axios.get(pokemon.url);
      return details.data;
    });
    
    return Promise.all(promises);
  } catch (error) {
    console.error("Error fetching pokemon list:", error);
    return [];
  }
};

// 2. Get Pokemon by Type (for Pokedex page)
export const getPokemonByType = async (type) => {
  if (type === 'all') {
    return await getPokemonList(20, 0);
  }

  const response = await axios.get(`https://pokeapi.co/api/v2/type/${type}`);
  
  // Map the specific type structure to match our Card format
  const pokemonData = response.data.pokemon.map((p) => {
    const urlParts = p.pokemon.url.split('/');
    const id = urlParts[urlParts.length - 2];
    return {
      id: parseInt(id),
      name: p.pokemon.name,
      sprites: {
        front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
      },
      types: [{ type: { name: type } }]
    };
  });

  return pokemonData;
};

// 3. Get Full Details (for Details page) - THIS IS THE ONLY VERSION WE NEED
export const getPokemonDetails = async (id) => {
  try {
    // A. Get Core Data (Stats, Types, Abilities)
    const pokemonRes = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
    
    // B. Get Species Data (Description/Flavor Text)
    const speciesRes = await axios.get(pokemonRes.data.species.url);

    // C. Extract English Description
    const flavorTextEntry = speciesRes.data.flavor_text_entries.find(
      (entry) => entry.language.name === 'en'
    );
    
    const description = flavorTextEntry 
      ? flavorTextEntry.flavor_text.replace(/[\f\n\r]/g, ' ') 
      : 'No description available.';

    return {
      ...pokemonRes.data,
      description: description,
      image: pokemonRes.data.sprites.other['official-artwork'].front_default || pokemonRes.data.sprites.front_default
    };
  } catch (error) {
    console.error("Error fetching details:", error);
    throw error;
  }
};

// --- NEW FUNCTIONS FOR DESCRIPTIONS ---

// 4. Get Description of an Ability
export const getAbilityDetails = async (abilityName) => {
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/ability/${abilityName}`);
    const entry = response.data.effect_entries.find(e => e.language.name === 'en');
    return entry ? entry.short_effect : "No description available.";
  } catch (error) {
    console.error(error); // <--- FIX: We now use the variable!
    return "Description not found.";
  }
};

// 5. Get Description/Sprite of an Item
export const getItemDetails = async (itemName) => {
  try {
    // Convert "Life Orb" -> "life-orb" for API
    const formattedName = itemName.toLowerCase().replace(/ /g, '-');
    const response = await axios.get(`https://pokeapi.co/api/v2/item/${formattedName}`);
    
    const entry = response.data.effect_entries.find(e => e.language.name === 'en');
    return {
      name: response.data.name,
      sprite: response.data.sprites.default,
      effect: entry ? entry.short_effect : "No description available."
    };
  } catch (error) {
    console.error(error); // <--- FIX: We now use the variable!
    return null; 
  }
};