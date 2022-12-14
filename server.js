// express makes https requests

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { engine } = require("express-handlebars");
const { getSign, addSign } = require("./db.js");
const { hash, compare } = require("./bcrypt.js");

app.use(express.static("./public"));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
//  bodyParser makes sure that we can parse the incoming req bodies

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    return res.redirect("/registration");
});

// ---------- REGISTRATION PAGE ----------

//GET
app.get("/registration", (req, res) => {
    return res.render("registration");
});

app.post("/registration", (req, res) => {
    const body = req.boddy;
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
