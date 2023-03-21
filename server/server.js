const path = require("path");
const express = require("express");
const session = require('express-session');
const routes = require("./routes");
const sequelize = require("./config/connection");
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

const sess = {
  secret: 'Secretly secret',
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

//apply session middleware
app.use(session(sess));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
// test api route for proxy in dev, can delete later
app.get("/", (req, res) => {
  res.send({message: "yo"});
});
// turn on routes
app.use(routes);

// catchall route routes to index.html in dist in production when no api routes are hit
//this points client to the react frontend
if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}
// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log("Now listening"));
});
