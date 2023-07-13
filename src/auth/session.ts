// const express = require("express");
// const server = express();
// const sessions = require("express-session");
// const cookieParser = require("cookie-parser");

// const oneDay = 1000 * 60 * 60 * 24;
// server.use(
//   sessions({
//     secret: "secret-learnhub",
//     saveUninitialized: true,
//     cookie: { maxAge: oneDay },
//     resave: false,
//   })
// );

// server.use(express.urlencoded({ extended: true }));
// server.use(express.json());
// server.use(cookieParser());
// server.use(express.static(__dirname));

// const myusername = "genochs";
// const mypassword = "passwd";

// let session;

// server.get("/", (req, res) => {
//   session = req.session;
//   if (session.userid) {
//     res.send("Welcome User <a href='/logout'>click to logout</a>");
//   } else res.sendFile("views/index.html", { root: __dirname });
// });

// server.post("/user", (req, res) => {
//   if (req.body.username == myusername && req.body.password == mypassword) {
//     session = req.session;
//     session.userid = req.body.username;
//     console.log(req.session);
//     res.send(`Hey there, welcome <a href=\'/logout'>click to logout</a>`);
//   } else {
//     res.send("Invalid username or password");
//   }
// });

// server.get("/logout", (req, res) => {
//   req.session.destroy();
//   res.redirect("/");
// });

// server.listen(3000, () => {
//   console.log("serverlication listening on port 3000!");
// });
