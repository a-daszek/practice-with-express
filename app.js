const fs = require("fs"); //filesystem package z nodejs -> żeby otwierać i odczytywać pliki

const path = require("path");

const express = require("express");
const uuid = require("uuid");


const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs"); //funkcja umożliwiająca ustawianie/dodawanie specjalnych opcji dla (express) app

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false })); //tego potrzebujemy żeby móc przechowywać inputy
//middleware is a function that executes on every incoming request, so multiple incoming requests

// app.get("/", function(req, res){ <=== tak było przed poznaniem rozszerzenia ejs, które umożliwia tworzenie dynamicznych plików html na serwerze
//     const htmlFilePath = path.join(__dirname, "views", "index.html");
//     res.sendFile(htmlFilePath)
// });

app.get("/", function (req, res) {
    res.render("index");
});

app.get("/about", function (req, res) {
    res.render("about");
});

app.get("/confirm", function (req, res) {
    res.render("confirm");
});

app.get("/recommend", function (req, res) {
    res.render("recommend");
});

app.post("/recommend", function (req, res) { //można znowu użyć nazwy "recommend" bo są inne metody -> get i post
    const restaurant = req.body; //obiekt z informacjami o restauracji, provided by user
    restaurant.id = uuid.v4(); //to nie jest częścią obiektu "restaurant", który dostarczył użytkownik, v4 dostarczy nam unikalne, randomowe id
    const filePath = path.join(__dirname, "data", "restaurants.json");

    const fileData = fs.readFileSync(filePath);
    const storedRestaurants = JSON.parse(fileData); //tłumaczymy na js array

    storedRestaurants.push(restaurant);

    fs.writeFileSync(filePath, JSON.stringify(storedRestaurants));

    res.redirect("/confirm"); // z express
});

app.get("/restaurants", function (req, res) {
    const filePath = path.join(__dirname, "data", "restaurants.json");

    const fileData = fs.readFileSync(filePath);
    const storedRestaurants = JSON.parse(fileData); //tłumaczymy na js array

    res.render("restaurants", { numberOfRestaurants: storedRestaurants.length, restaurants: storedRestaurants, });
});

app.get("/restaurants/:id", function (req, res) { // dzięki temu tworzy się ścieżka do strony z informacjami o restauracji | jest ":id", a gdyby było ":resID", to w linijce niżej by było "req.params.resID"
    const restaurantId = req.params.id;
    const filePath = path.join(__dirname, "data", "restaurants.json");

    const fileData = fs.readFileSync(filePath);
    const storedRestaurants = JSON.parse(fileData);

    for (const restaurant of storedRestaurants) {
        if (restaurant.id === restaurantId) {
            return res.render("restaurant-detail", { restaurant: restaurant });
        }
    }
    
    res.render("404");

});

//dodatkowo dodaliśmy paczkę komendą "node install uuid", dzięki czemu będą się generować unikalne id dla restauracji

app.use(function(req, res){ //nasze własne middleware, wyświetli błąd 404 w przypadku gdy żaden request nie będzie się zgadzał
    res.render("404");
});

app.use(function(error, req, res, next){ //"next" allows to have multiple middlewares that will work together
    res.render("500");
});

app.listen(3000);