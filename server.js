// express makes https requests

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { engine } = require("express-handlebars");
const db = require("./db.js");
const encrypt = require("./bcrypt.js");

app.use(express.static("./public"));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
//  bodyParser makes sure that we can parse the incoming req bodies

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const urlEncodedMiddleware = express.urlencoded({ extended: false });
app.use(urlEncodedMiddleware);

// ---------- COOKIES ----------

const cookieSession = require("cookie-session");

app.use(
    cookieSession({
        secret: process.env.SESSION_SECRET,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

// ---------- DEFAULT ROUTE ----------

app.get("/", (req, res) => {
    if (req.session.userId && !req.session.signatureId) {
        res.redirect("/petition");
    } else if (req.session.userId && req.session.signatureId) {
        res.redirect("/petition/thanks");
    } else {
        res.redirect("/registration");
    }
});
// Default route working.

// ---------- REGISTRATION PAGE ----------

app.get("/registration", (req, res) => {
    if (req.session.userId && !req.session.signatureId) {
        res.redirect("/petition");
    } else if (req.session.userId && req.session.signatureId) {
        res.redirect("/thanks");
    } else {
        res.render("registration", { title: "registration" });
    }
});

app.post("/registration", (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    console.log(req.body);
    encrypt.hash(password).then((hash) => {
        return db.insertUser(firstName, lastName, email, hash);
    });
    res.redirect("/login");
});

// ---------- LOGIN PAGE ----------

app.get("/login", (req, res) => {
    if (req.session.userId && !req.session.signatureId) {
        res.redirect("/petition");
    } else if (req.session.userId && req.session.signatureId) {
        res.redirect("/thanks");
    } else {
        res.render("login", { title: "Login" });
    }
});

app.post("/login", (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    //console.log("email", email);
    //console.log("pass", password);
    db.findUserByEmail(email).then((result) => {
        console.log(result);
        db.authenticate(email, password).then((success) => {
            console.log(success);
            if (success === true) {
                req.session.userId = result.rows[0].id;
                req.session.signatureId = result.rows[0].id;
                res.redirect("/petition");
            } else {
                res.redirect("/login");
            }
        });
    });
});

// ---------- PETITION PAGE ----------

app.get("/petition", (req, res) => {
    if (!req.session.userId && !req.session.signatureId) {
        return res.redirect("/login");
    }
    res.render("petition", {
        layout: "main",
    });
});

app.post("/petition", (req, res) => {
    let url = req.body.signature;
    let username = req.session.userId;
    let title = req.session.userId;

    let destination = req.session.userId;

    db.insertSignature(url, username, title, destination)
        .then((sign) => {
            req.session.signatureId = sign[0].user_id;
            res.redirect("/thanks");
        })
        .catch((err) => {
            console.log("ERROR in inserting Signature: ", err);
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
