import {
  saveToLocalStorage,
  getlocalStorage,
  removeFromLocalStorage,
} from "./localstorage.js";

let pokemonImg = document.getElementById("pokemonImg");
let pokemonName = document.getElementById("pokemonName");
let favBtn = document.getElementById("favBtn");
let type = document.getElementById("type");
let location = document.getElementById("location");
let abilities = document.getElementById("abilities");
let movesText = document.getElementById("moves");
let evolutions = document.getElementById("evolutions");
let searchNavbar = document.getElementById("search-navbar");
let navbarSearch = document.getElementById("navbar-search");
let favoritesPanelBtn = document.getElementById("favoritesPanelBtn");
let favoritesPanelList = document.getElementById("favoritesPanelList");
let randomBtn = document.getElementById("randomBtn");

let pokemon = "";
let pokemonLocation = "";
let pokemonEvo = "";
let pokemonEvoChain = "";

let isShiny = false;
let isFav = false;

const pokemonApi = async (pokemon) => {
  const promise = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
  const data = await promise.json();
  return data;
};
const pokemonLocationApi = async (pokemon) => {
  const promise = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemon}/encounters`
  );
  const data = await promise.json();
  if (Array.isArray(data) && data.length > 0 && data[0].location_area) {
    return data[0].location_area.name;
  } else {
    return "N/A";
  }
};
const pokemonEvolutions = async (id) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${id}/`);
    
    if (!response.ok) {
      evolutions.textContent = "N/A";
      return null;
    }

    const data = await response.json();
    return data.chain;
  } catch (error) {
    evolutions.textContent = "N/A";
    return null;
  }
};


const getEvolutionPath = (evolution, path = []) => {
  path.push(evolution.species.name);

  if (evolution.evolves_to.length > 0) {
    getEvolutionPath(evolution.evolves_to[0], path);
  }

  return path;
};
const getTypePath = (type, typePath = []) => {
  path.push(type.type.name);

  if (type.types.length > 0) {
    getTypePath(type.types[0], typePath);
  }

  return typePath;
};

favBtn.addEventListener("click", async () => {
  if (pokemon) {
    const pokemonName = pokemon.species.name;

    if (getlocalStorage().includes(pokemonName)) {
      removeFromLocalStorage(pokemonName)
    } else {
      saveToLocalStorage(pokemonName);
    }
  }
});


favoritesPanelBtn.addEventListener("click", () => {
  let favorites = getlocalStorage();

  favoritesPanelList.textContent = "";

  favorites.map((pokemonName) => {
    let p = document.createElement("p");

    p.textContent = pokemonName;

    let button = document.createElement("button");

    button.type = "button";
    button.textContent = "X";

    button.classList.add(
      "text-gray-400",
      "bg-transparent",
      "hover:bg-gray-200",
      "hover:text-gray-900",
      "rounded-lg",
      "text-sm",
      "w-8",
      "h-8",
      "justify-end",
      "dark:hover:bg-gray-600",
      "dark:hover:text-white"
    );

    button.addEventListener("click", () => {
      removeFromLocalStorage(pokemon);

      p.remove();
    });
    p.append(button);
    favoritesPanelList.append(p);
  });
});

const toggleShiny = () => {
  isShiny = !isShiny;
  updatePokemonImage();
};
const toggleFavorite = () => {
  isFav = !isFav;
  updateFavoriteImage();
};

const updatePokemonImage = () => {
  if (pokemon && pokemon.sprites && pokemon.sprites.other) {
    const spriteKey = isShiny ? "front_shiny" : "front_default";
    const imageUrl = pokemon.sprites.other["official-artwork"][spriteKey];
    pokemonImg.src = imageUrl;
  }
};
const updateFavoriteImage = () => {
  const isPokemonFavorited = getlocalStorage().includes(pokemon.species.name);

  if (isPokemonFavorited) {
    favBtn.src = "./assets/svgs/heart-fill.svg";
    isFav = true;
  } else {
    favBtn.src = "./assets/svgs/heart-thin.svg";
    isFav = false;
  }
};

favBtn.addEventListener("click", toggleFavorite);
pokemonImg.addEventListener("click", toggleShiny);

searchNavbar.addEventListener("keydown", async (event) => {
  let evolutionPath;

  if (event.key === "Enter") {
    pokemon = await pokemonApi(event.target.value.toLowerCase());
    pokemonLocation = await pokemonLocationApi(
      event.target.value.toLowerCase()
    );
    pokemonEvoChain = await pokemonEvolutions(pokemon.id);
    updateFavoriteImage()
    pokemonName.textContent =
      pokemon.species.name.charAt(0).toUpperCase() +
      pokemon.species.name.slice(1);
    type.textContent = pokemon.types.map((type) => type.type.name).join(", ");
    location.textContent = pokemonLocation;

    if (pokemon && pokemon.sprites && pokemon.sprites.other) {
      isShiny = false;
      updatePokemonImage();
    }

    pokemon.abilities.forEach((ability, index) => {
      abilities.textContent += ability.ability.name;
      if (index < pokemon.abilities.length - 1) {
        abilities.textContent += ", ";
      }
    });

    pokemon.moves.forEach((moves, index) => {
      movesText.textContent += moves.move.name;
      if (index < pokemon.moves.length - 1) {
        movesText.textContent += ", ";
      }
    });
    evolutionPath = getEvolutionPath(pokemonEvoChain);

    if (Array.isArray(evolutionPath)) {
      evolutions.textContent = evolutionPath.join(", ");
    } else {
      evolutions.textContent = "N/A";
    }
    searchNavbar.value = "";
  }
});

navbarSearch.addEventListener("keydown", async (event) => {
  let evolutionPath;

  if (event.key === "Enter") {
    // Fetch data for the entered Pokemon name or ID
    const searchData = await pokemonApi(event.target.value.toLowerCase());

    // Check if the response is successful and contains valid Pokemon data
    pokemon = searchData;
    pokemonLocation = searchData.location_area
      ? searchData.location_area.name
      : "N/A";
    pokemonEvoChain = await pokemonEvolutions(pokemon.id);

    // Update the UI with the new Pokemon data
    updateFavoriteImage();
    pokemonName.textContent =
      pokemon.species.name.charAt(0).toUpperCase() +
      pokemon.species.name.slice(1);
    type.textContent = pokemon.types.map((type) => type.type.name).join(", ");
    location.textContent = pokemonLocation;

    if (pokemon && pokemon.sprites && pokemon.sprites.other) {
      isShiny = false;
      updatePokemonImage();
    }

    abilities.textContent = "";
    pokemon.abilities.forEach((ability, index) => {
      abilities.textContent += ability.ability.name;
      if (index < pokemon.abilities.length - 1) {
        abilities.textContent += ", ";
      }
    });

    movesText.textContent = "";
    pokemon.moves.forEach((moves, index) => {
      movesText.textContent += moves.move.name;
      if (index < pokemon.moves.length - 1) {
        movesText.textContent += ", ";
      }
    });

    evolutionPath = getEvolutionPath(pokemonEvoChain);

    if (Array.isArray(evolutionPath)) {
      evolutions.textContent = evolutionPath.join(", ");
    } else {
      evolutions.textContent = "N/A";
    }

    navbarSearch.value = "";
    searchNavbar.value = "";
  }
});

randomBtn.addEventListener("click", async () => {
  let evolutionPath;
  const randomPokemonId = Math.floor(Math.random() * 649) + 1;

  pokemon = await pokemonApi(randomPokemonId);
  pokemonLocation = await pokemonLocationApi(randomPokemonId);
  pokemonEvoChain = await pokemonEvolutions(pokemon.id);

  updateFavoriteImage();
  pokemonName.textContent =
    pokemon.species.name.charAt(0).toUpperCase() +
    pokemon.species.name.slice(1);
  type.textContent = pokemon.types.map((type) => type.type.name).join(", ");
  location.textContent = pokemonLocation;

  if (pokemon && pokemon.sprites && pokemon.sprites.other) {
    isShiny = false;
    updatePokemonImage();
  }

  abilities.textContent = "";
  pokemon.abilities.forEach((ability, index) => {
    abilities.textContent += ability.ability.name;
    if (index < pokemon.abilities.length - 1) {
      abilities.textContent += ", ";
    }
  });

  movesText.textContent = "";
  pokemon.moves.forEach((moves, index) => {
    movesText.textContent += moves.move.name;
    if (index < pokemon.moves.length - 1) {
      movesText.textContent += ", ";
    }
  });

  evolutionPath = getEvolutionPath(pokemonEvoChain);

  if (Array.isArray(evolutionPath)) {
    evolutions.textContent = evolutionPath.join(", ");
  } else {
    evolutions.textContent = "N/A";
  }
});

const siteLoad = async () => {
  let evolutionPath;
  const randomPokemonId = Math.floor(Math.random() * 649) + 1;

  pokemon = await pokemonApi(randomPokemonId);
  pokemonLocation = await pokemonLocationApi(randomPokemonId);
  pokemonEvoChain = await pokemonEvolutions(randomPokemonId);

  updateFavoriteImage();
  pokemonName.textContent =
    pokemon.species.name.charAt(0).toUpperCase() +
    pokemon.species.name.slice(1);
  type.textContent = pokemon.types.map((type) => type.type.name).join(", ");
  location.textContent = pokemonLocation;

  if (pokemon && pokemon.sprites && pokemon.sprites.other) {
    isShiny = false;
    updatePokemonImage();
  }

  abilities.textContent = "";
  pokemon.abilities.forEach((ability, index) => {
    abilities.textContent += ability.ability.name;
    if (index < pokemon.abilities.length - 1) {
      abilities.textContent += ", ";
    }
  });

  movesText.textContent = "";
  pokemon.moves.forEach((moves, index) => {
    movesText.textContent += moves.move.name;
    if (index < pokemon.moves.length - 1) {
      movesText.textContent += ", ";
    }
  });

  evolutionPath = getEvolutionPath(pokemonEvoChain);

  if (Array.isArray(evolutionPath)) {
    evolutions.textContent = evolutionPath.join(", ");
  } else {
    evolutions.textContent = "N/A";
  };
};
siteLoad();
