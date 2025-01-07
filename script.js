// DOM ELEMENT SELECTION
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const pokemonImg = document.getElementById("pokemon-img");
const pokemonName = document.getElementById("pokemon-name");
const pokemonId = document.getElementById("pokemon-id");
const weight = document.getElementById("weight");
const height = document.getElementById("height");
const types = document.getElementById("types");
const hp = document.getElementById("hp");
const attack = document.getElementById("attack");
const defense = document.getElementById("defense");
const specialAttack = document.getElementById("special-attack");
const specialDefense = document.getElementById("special-defense");
const speed = document.getElementById("speed");
const fccProxyApi = "https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/";
const pokeApiBaseUrl = "https://pokeapi.co/api/v2/pokemon/";

// Async function to fetch data from the API
const fetchPokemon = async () => {
  try {
    // To enable search by either name or id
    const pokemonNameOrId = searchInput.value.toLowerCase();
    const res = await fetch(`${fccProxyApi}${pokemonNameOrId}`);
    const data = await res.json();
    displayPokemon(data);
    fetchOfficialArtwork(pokemonNameOrId);
    // console.log(data.stats[5]);
  } catch (err) {
    resetPage();
    alert("Pokémon not found");
    console.log(`Pokémon not found: ${err}`);
  }
};

// fetchPokemon();

const displayPokemon = (data) => {
  // Setting Pokémon details
  pokemonName.textContent = `${data.name}`;
  pokemonId.textContent = `#${data.id}`;
  weight.textContent = `${data.weight}`;
  height.textContent = `${data.height}`;

  // Setting the pokémon types
  types.innerHTML = data.types
    .map((obj) => `<span class="type ${obj.type.name}">${obj.type.name}</span>`)
    .join("");

  //  Setting the pokémon stats
  hp.textContent = data.stats[0].base_stat;
  attack.textContent = data.stats[1].base_stat;
  defense.textContent = data.stats[2].base_stat;
  specialAttack.textContent = data.stats[3].base_stat;
  specialDefense.textContent = data.stats[4].base_stat;
  speed.textContent = data.stats[5].base_stat;
};

// Functionality to fetch official artwork from PokeAPI
const fetchOfficialArtwork = async (pokemonNameOrId) => {
  try {
    const res = await fetch(`${pokeApiBaseUrl}${pokemonNameOrId}`);
    const data = await res.json();

    // Setting the official artwork image
    pokemonImg.src = data.sprites.other["official-artwork"].front_default;
    pokemonImg.alt = `${data.name} official artwork`;
  } catch (err) {
    console.log(`Error fetching official artwork: ${err}`);
    alert("Failed to fetch official artwork image");
  }
};

// fetchOfficialArtwork("bulbasaur");

// Functionality to reset the page display
const resetPage = async () => {
  try {
    // Fetch Bulbasaur's data
    const res = await fetch(`${fccProxyApi}1`);
    const data = await res.json();
    displayPokemon(data);
    fetchOfficialArtwork(1);
  } catch (err) {
    console.log(`Error fetching Bulbasaur data: ${err}`);
    alert("Failed to reset to Bulbasaur");
  }
};

// Resets the page on initial loading
resetPage();

// Event listener for the form submission
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  fetchPokemon();
});
