const express = require("express");

const router = express.Router(); // trzeba tak bo "app" powinno być tylko raz użyte w głównym pliku aplikacji

router.get("/", function (req, res) {
    res.render("index");
});

router.get("/about", function (req, res) {
    res.render("about");
});


module.exports = router;