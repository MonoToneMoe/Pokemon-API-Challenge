import { saveToLocalStorage, getlocalStorage, removeFromLocalStorage } from "./localstorage.js";

let pokemonImg = document.getElementById("");
let pokemonName = document.getElementById("");
let favBtn = document.getElementById("");
let type = document.getElementById("");
let location = document.getElementById("");
let abilities = document.getElementById("");
let moves = document.getElementById("");
let evolutions = document.getElementById("");
let search = document.getElementById("search");
let favoritesPanelBtn = document.getElementById("favoritesPanelBtn");
let favoritesPanelList = document.getElementById("favoritesPanelList");
let randomBtn = document.getElementById("randomBtn");

let pokemon = "";

const pokemonApi = async (pokemon) => {
    const promise = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    const data = await promise.json();
    return data;
}

search.addEventListener('keydown', async (event)=>{
    if(event.key === "Enter"){
        pokemon = await pokemonApi(event.target.value);
        console.log(pokemon)
        search.value = '';
    }
})

