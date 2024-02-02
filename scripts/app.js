import { saveToLocalStorage, getlocalStorage, removeFromLocalStorage } from "./localstorage.js";

const pokemonImg = document.getElementById("pokemonImg");
const pokemonName = document.getElementById("pokemonName");
const favBtn = document.getElementById("favBtn");
const type = document.getElementById("type");
const location = document.getElementById("location");
const abilities = document.getElementById("abilities");
const movesText = document.getElementById("moves");
const evolutions = document.getElementById("evolutions");
const searchNavbar = document.getElementById("search-navbar");
const navbarSearch = document.getElementById("navbar-search");
const favoritesPanelBtn = document.getElementById("favoritesPanelBtn");
const favoritesPanelList = document.getElementById("favoritesPanelList");
const randomBtn = document.getElementById("randomBtn");

let pokemon = "";
let pokemonLocation = "";
let pokemonEvoChain = "";
let evolutionPath = "";

let isShiny = false;
let isFav = false;

const pokemonApi = async (pokemon) => {
    const promise = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    const data = await promise.json();
    return data;
};

const pokemonLocationApi = async (pokemon) => {
    const promise = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}/encounters`);
    const data = await promise.json();
    return data[0].location_area.name;
};

const pokemonEvolutions = async (id) => {
    const promise = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${id}/`);
    const data = await promise.json();
    return data.chain;
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

const updatePokemonImage = () => {
    if (pokemon && pokemon.sprites && pokemon.sprites.other) {
        const spriteKey = isShiny ? 'front_shiny' : 'front_default';
        const imageUrl = pokemon.sprites.other['official-artwork'][spriteKey];
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

favBtn.addEventListener('click', async () => {
    if (pokemon) {
        saveToLocalStorage(pokemon.species.name);
    }
});

favoritesPanelBtn.addEventListener('click', () => {
    const favorites = getlocalStorage();

    favoritesPanelList.textContent = "";

    favorites.forEach((pokemonName) => {
        const p = document.createElement("p");

        p.textContent = pokemonName;

        const button = document.createElement('button');

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

        button.addEventListener('click', () => {
            removeFromLocalStorage(pokemon);

            p.remove();
        });
        p.append(button);
        favoritesPanelList.append(p);
    });
});

searchNavbar.addEventListener('keydown', async (event) => {
    let evolutionPath;

    if (event.key === "Enter") {
        pokemon = await pokemonApi(event.target.value.toLowerCase());
        pokemonLocation = await pokemonLocationApi(event.target.value.toLowerCase());
        pokemonEvoChain = await pokemonEvolutions(pokemon.id);
        updateFavoriteImage();
        pokemonName.textContent = pokemon.species.name.charAt(0).toUpperCase() + pokemon.species.name.slice(1);
        type.textContent = pokemon.types.map(type => type.type.name).join(', ');
        location.textContent = pokemonLocation;

        if (pokemon && pokemon.sprites && pokemon.sprites.other) {
            isShiny = false;
            updatePokemonImage();
        }

        abilities.textContent = "";
        pokemon.abilities.forEach((ability, index) => {
            abilities.textContent += ability.ability.name;
            if (index < pokemon.abilities.length - 1) {
                abilities.textContent += ', ';
            }
        });

        movesText.textContent = "";
        pokemon.moves.forEach((moves, index) => {
            movesText.textContent += moves.move.name;
            if (index < pokemon.moves.length - 1) {
                movesText.textContent += ', ';
            }
        });
        evolutionPath = getEvolutionPath(pokemonEvoChain);

        if (Array.isArray(evolutionPath)) {
            evolutions.textContent = evolutionPath.join(", ");
        } else {
            evolutions.textContent = "N/A";
        }
        searchNavbar.value = '';
    }
});

navbarSearch.addEventListener('keydown', async (event) => {
    let evolutionPath;

    if (event.key === "Enter") {
        pokemon = await pokemonApi(event.target.value.toLowerCase());
        pokemonLocation = await pokemonLocationApi(event.target.value.toLowerCase());
        pokemonEvoChain = await pokemonEvolutions(pokemon.id);
        updateFavoriteImage();
        pokemonName.textContent = pokemon.species.name.charAt(0).toUpperCase() + pokemon.species.name.slice(1);
        type.textContent = pokemon.types.map(type => type.type.name).join(', ');
        location.textContent = pokemonLocation;

        if (pokemon && pokemon.sprites && pokemon.sprites.other) {
            isShiny = false;
            updatePokemonImage();
        }

        abilities.textContent = "";
        pokemon.abilities.forEach((ability, index) => {
            abilities.textContent += ability.ability.name;
            if (index < pokemon.abilities.length - 1) {
                abilities.textContent += ', ';
            }
        });

        movesText.textContent = "";
        pokemon.moves.forEach((moves, index) => {
            movesText.textContent += moves.move.name;
            if (index < pokemon.moves.length - 1) {
                movesText.textContent += ', ';
            }
        });
        evolutionPath = getEvolutionPath(pokemonEvoChain);

        if (Array.isArray(evolutionPath)) {
            evolutions.textContent = evolutionPath.join(", ");
        } else {
            evolutions.textContent = "N/A";
        }
        searchNavbar.value = '';
    }
});

randomBtn.addEventListener('click', async () => {
    const randomPokemonId = Math.floor(Math.random() * 649) + 1;
    pokemon = await pokemonApi(randomPokemonId);
    pokemonLocation = await pokemonLocationApi(randomPokemonId);
    pokemonEvoChain = await pokemonEvolutions(pokemon.id);

    updateFavoriteImage();
    pokemonName.textContent = pokemon.species.name.charAt(0).toUpperCase() + pokemon.species.name.slice(1);
    type.textContent = pokemon.types.map(type => type.type.name).join(', ');
    location.textContent = pokemonLocation;

    if (pokemon && pokemon.sprites && pokemon.sprites.other) {
        isShiny = false;
        updatePokemonImage();
    }

    abilities.textContent = "";
    pokemon.abilities.forEach((ability, index) => {
        abilities.textContent += ability.ability.name;
        if (index < pokemon.abilities.length - 1) {
            abilities.textContent += ', ';
        }
    });

    movesText.textContent = "";
    pokemon.moves.forEach((moves, index) => {
        movesText.textContent += moves.move.name;
        if (index < pokemon.moves.length - 1) {
            movesText.textContent += ', ';
        }
    });

    evolutionPath = getEvolutionPath(pokemonEvoChain);
    evolutions.textContent = Array.isArray(evolutionPath) ? evolutionPath.join(", ") : "N/A";
});
