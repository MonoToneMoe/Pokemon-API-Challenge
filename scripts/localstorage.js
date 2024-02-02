const saveToLocalStorage = (pokemon) => {
    let favorites =  getlocalStorage();

    if(!favorites.includes(pokemon)) {
        favorites.push(pokemon)
    }

    localStorage.setItem("Favorites", JSON.stringify(favorites));
}

const getlocalStorage = () => {
    let localStorageData = localStorage.getItem("Favorites");

    if(localStorageData == null){
        return [];
    }

    return JSON.parse(localStorageData);
}

const removeFromLocalStorage = (digimon) => {
    let favorites = getlocalStorage();

    let nameIndex = favorites.indexOf(digimon);

    favorites.splice(nameIndex, 1);

    localStorage.setItem("Favorites", JSON.stringify(favorites));
}

export {saveToLocalStorage, getlocalStorage, removeFromLocalStorage};