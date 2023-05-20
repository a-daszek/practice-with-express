const path = require("path");

const express = require("express");

const defaultRoutes = require("./routes/default");
const restaurantRoutes = require("./routes/restaurants")

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs"); //funkcja umożliwiająca ustawianie/dodawanie specjalnych opcji dla (express) app

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false })); //tego potrzebujemy żeby móc przechowywać inputy
//middleware is a function that executes on every incoming request, so multiple incoming requests

app.use("/", defaultRoutes); //every route will get handled by defaultRoutes
app.use("/", restaurantRoutes);


// app.get("/", function(req, res){ <=== tak było przed poznaniem rozszerzenia ejs, które umożliwia tworzenie dynamicznych plików html na serwerze
//     const htmlFilePath = path.join(__dirname, "views", "index.html");
//     res.sendFile(htmlFilePath)
// });
// -------------------------------------------------------------------------
// app.get("/", function (req, res) { // <=== tak było bez folderu "routes"
//     res.render("index");
// });

// app.get("/about", function (req, res) {
//     res.render("about");
// });

app.use(function (req, res) { //nasze własne middleware, wyświetli błąd 404 w przypadku gdy żaden request nie będzie się zgadzał
    res.status(404).render("404");
});

app.use(function (error, req, res, next) { //"next" allows to have multiple middlewares that will work together
    res.status(500).render("500");
});

app.listen(3000);

//ogólnie to przed formatowaniem apki dodaje się wszystkie customowe error 404 page not found strony