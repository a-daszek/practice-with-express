const path = require("path");

const fs = require("fs");

const filePath = path.join(__dirname,".." ,"data", "restaurants.json"); //".." <-- this indicates that we want to go to the parent directory after directory that we are currently in

function getStoredRestaurants (){ //to jest to drugie w module.exports, nazwa nie do zmiany w tamtym module, pierwsze getStoredRestaurants to już jest nasza nazwa i nie musi być taka sama

    const fileData = fs.readFileSync(filePath);
    const storedRestaurants = JSON.parse(fileData); //tłumaczymy na js array

    return storedRestaurants;
}

function storeRestaurants(storableRestaurants){
    fs.writeFileSync(filePath, JSON.stringify(restaurants));
}

module.exports = {
    getStoredRestaurants: getStoredRestaurants,
    storeRestaurants: storeRestaurants

};