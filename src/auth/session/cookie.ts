// const express = require('express')
// const app = express()
// const sessions = require('express-session');
// const cookieParser = require("cookie-parser");

// const oneDay = 1000 * 60 * 60 * 24;
// app.use(sessions({
//     secret: "secrctekeykokdev",
//     saveUninitialized: true,
//     cookie: { maxAge: oneDay },
//     resave: false
// }));
// app.use(express.urlencoded({ extended: true }))
// app.use(express.json())
// app.use(cookieParser());
// app.use(express.static(__dirname));

// const myusername = 'kokdev'
// const mypassword = 'pass'

// // a variable to save a session
// var session;

// app.get('/', (req, res) => {
//     session = req.session;
//     if (session.userid) {
//         res.send("Welcome User <a href=\'/logout'>click to logout</a>");
//     } else
//         res.sendFile('views/index.html', { root: __dirname })
// });

// app.post('/user', (req, res) => {
//     if (req.body.username == myusername && req.body.password == mypassword) {
//         session = req.session;
//         session.userid = req.body.username;
//         console.log(req.session)
//         res.send(`Hey there, welcome <a href=\'/logout'>click to logout</a>`);
//     } else {
//         res.send('Invalid username or password');
//     }
// })

// app.get('/logout', (req, res) => {
//     req.session.destroy();
//     res.redirect('/');
// });

// app.listen(3000, () => {
//     console.log('Application listening on port 3000!')
// })