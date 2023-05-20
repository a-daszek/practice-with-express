const express = require("express");
const uuid = require("uuid");

const resData = require("../util/restaurant-data"); //relative path, sibling file of the file in with we have THIS code

const router = express.Router();

router.get("/restaurants", function (req, res) {
    let order = req.query.order;
    let nextOrder = "desc";

    if (order !== "asc" && order !== "desc") {
        order = "asc";
    }

    if (order === "desc") {
        nextOrder = "asc";
    }

    const storedRestaurants = resData.getStoredRestaurants();

    storedRestaurants.sort(function (resA, resB) { //sortujemy restauracje ==> queries
        if (
            (order === "asc" && resA.name > resB.name) ||
            (order === "desc" && resB.name > resA.name)
        ) {
            return 1;
        }
        return -1
    });

    res.render("restaurants", { numberOfRestaurants: storedRestaurants.length, restaurants: storedRestaurants, nextOrder: nextOrder });
});

router.get("/restaurants/:id", function (req, res) { // dzięki temu tworzy się ścieżka do strony z informacjami o restauracji | jest ":id", a gdyby było ":resID", to w linijce niżej by było "req.params.resID"
    const restaurantId = req.params.id;
    const storedRestaurants = resData.getStoredRestaurants();

    for (const restaurant of storedRestaurants) {
        if (restaurant.id === restaurantId) {
            return res.render("restaurant-detail", { restaurant: restaurant });
        }
    }

    res.status(404).render("404");
});

router.get("/confirm", function (req, res) {
    res.render("confirm");
});

router.get("/recommend", function (req, res) {
    res.render("recommend");
});

router.post("/recommend", function (req, res) { //można znowu użyć nazwy "recommend" bo są inne metody -> get i post
    const restaurant = req.body; //obiekt z informacjami o restauracji, provided by user
    restaurant.id = uuid.v4(); //to nie jest częścią obiektu "restaurant", który dostarczył użytkownik, v4 dostarczy nam unikalne, randomowe id
    const restaurants = resData.getStoredRestaurants();

    restaurants.push(restaurant);

    resData.storeRestaurants(restaurants);

    res.redirect("/confirm"); // z express
});

//dodatkowo dodaliśmy paczkę komendą "node install uuid", dzięki czemu będą się generować unikalne id dla restauracji

module.exports = router;