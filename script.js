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
const autocompleteList = document.getElementById("autocomplete-list");
const outerSuggestionContainer = document.getElementById(
  "outer-suggestion-container"
);
const fccProxyApi = "https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/";
const pokeApiBaseUrl = "https://pokeapi.co/api/v2/pokemon/";
let pokemonList = [];

// Fetch Pokemon Names and IDs once
const fetchPokemonList = async () => {
  try {
    const res = await fetch(`${pokeApiBaseUrl}?limit=1118`);
    const data = await res.json();
    pokemonList = data.results.map((pokemon, index) => ({
      name: pokemon.name,
      id: index + 1,
    }));
  } catch (error) {
    console.error("Error fetching Pokémon list:", error);
  }
};

fetchPokemonList();

// Utility function to check if the user is on a mobile device
const isMobileDevice = () => /Mobi|Android/i.test(navigator.userAgent);

// Handle user input for autocomplete.
const handleUserInput = () => {
  const inputValue = searchInput.value.toLowerCase();
  autocompleteList.innerHTML = ""; // Clear previous suggestions

  if (inputValue) {
    const filteredList = pokemonList.filter(
      (pokemon) =>
        pokemon.name.startsWith(inputValue) ||
        pokemon.id.toString().startsWith(inputValue)
    );

    filteredList.forEach((pokemon) => {
      const suggestionItem = document.createElement("div");
      suggestionItem.classList.add("autocomplete-suggestion");
      suggestionItem.textContent = `${pokemon.name} (#${pokemon.id})`;

      suggestionItem.addEventListener("click", () => {
        searchInput.value = pokemon.name;
        if (!isMobileDevice()) {
          searchInput.focus(); // Keep focus on the input field only for non-mobile devices.
        }
        autocompleteList.innerHTML = ""; // Clear suggestions
        fetchPokemon(); // Fetch and display the selected Pokémon's data
      });

      autocompleteList.appendChild(suggestionItem);
    });

    outerSuggestionContainer.style.display = "block";
    autocompleteList.style.display = "block";
  }
};

searchInput.addEventListener("input", handleUserInput);

// Hide suggestions when clicking outside
document.addEventListener("click", (e) => {
  if (!searchInput.contains(e.target) && !autocompleteList.contains(e.target)) {
    autocompleteList.innerHTML = "";
    outerSuggestionContainer.style.display = "none";
  }
});

// Async function to fetch data from the APIs
const fetchPokemon = async () => {
  try {
    const pokemonNameOrId = searchInput.value.toLowerCase();

    const [fccRes, pokeRes] = await Promise.all([
      fetch(`${fccProxyApi}${pokemonNameOrId}`),
      fetch(`${pokeApiBaseUrl}${pokemonNameOrId}`),
    ]);

    const fccData = await fccRes.json();
    const pokeData = await pokeRes.json();

    displayPokemon(fccData, pokeData);
  } catch (err) {
    resetPage();
    alert("Pokémon not found");
    console.log(`Pokémon not found: ${err}`);
  }
};

// Functionality to display the Pokémon details
const displayPokemon = (fccData, pokeData) => {
  pokemonName.textContent = `${fccData.name}`;
  pokemonId.textContent = `#${fccData.id}`;
  weight.textContent = `${fccData.weight}`;
  height.textContent = `${fccData.height}`;
  pokemonImg.src = pokeData.sprites.other["official-artwork"].front_default;
  pokemonImg.alt = `${pokeData.name} official artwork image`;

  types.innerHTML = fccData.types
    .map((obj) => `<span class="type ${obj.type.name}">${obj.type.name}</span>`)
    .join("");

  hp.textContent = fccData.stats[0].base_stat;
  attack.textContent = fccData.stats[1].base_stat;
  defense.textContent = fccData.stats[2].base_stat;
  specialAttack.textContent = fccData.stats[3].base_stat;
  specialDefense.textContent = fccData.stats[4].base_stat;
  speed.textContent = fccData.stats[5].base_stat;
};

// Functionality to reset the page display
const resetPage = async () => {
  try {
    const [fccRes, pokeRes] = await Promise.all([
      fetch(`${fccProxyApi}1`),
      fetch(`${pokeApiBaseUrl}1`),
    ]);

    const fccData = await fccRes.json();
    const pokeData = await pokeRes.json();

    displayPokemon(fccData, pokeData);
    searchInput.value = "";
    autocompleteList.style.display = "none";
  } catch (err) {
    console.log(`Error fetching Bulbasaur data: ${err}`);
    alert("Failed to reset to Bulbasaur");
  }
};

resetPage();

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  fetchPokemon();
});
