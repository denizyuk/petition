// express makes https requests

const express = require("express");
const app = express();
app.use(express.static("./public"));
const { engine } = require("express-handlebars");
const { getSign, addSign } = require("./db.js");
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
//  bodyParser makes sure that we can parse the incoming req bodies
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.render("main", {
        layout: "main",
    });
});

// ---------- PETITION PAGE ----------

app.get("/petition", (req, res) => {
    res.render("petition", {
        layout: "main",
    });
});

// ---------- THANKS PAGE ----------

app.get("/thanks", (req, res) => {
    res.render("thanks", {
        layout: "main",
    });
});

// ---------- SIGNERS PAGE ----------

app.get("/signers", (req, res) => {
    res.render("signers", {
        layout: "main",
    });
});

// ---------- LOCALHOST ----------
app.listen(8080, () => {
    console.log("Server is up bruv  localhost:8080");
});
