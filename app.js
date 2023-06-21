const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const usuarios = [];
const tweets = [];

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.post("/sign-up", (req, res) => {
  const { username, avatar } = req.body;

  const usuario = {
    username,
    avatar,
  };

  usuarios.push(usuario);

  res.send("OK");
});

app.post("/tweets", (req, res) => {
  const { username, tweet } = req.body;

  const usuario = usuarios.find((user) => user.username === username);
  if (!usuario) {
    return res.status(401).send("UNAUTHORIZED");
  }

  const novoTweet = {
    username,
    tweet,
  };
  tweets.push(novoTweet);

  res.send("OK");
});

app.get("/tweets", (req, res) => {
  const tweetsResponse = tweets.slice(-10).map((tweet) => {
    const usuario = usuarios.find((user) => user.username === tweet.username);
    const { username, avatar } = usuario || {};
    return {
      username,
      avatar,
      tweet: tweet.tweet,
    };
  });

  res.json(tweetsResponse);
});
