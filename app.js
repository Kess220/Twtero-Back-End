const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const usuarios = [];
const tweets = [];

app.get("/", (req, res) => res.send("Hello World!"));

app.post("/sign-up", (req, res) => {
  const { username, avatar } = req.body;

  if (
    !username ||
    typeof username !== "string" ||
    !avatar ||
    typeof avatar !== "string"
  ) {
    return res.status(400).send("Todos os campos são obrigatórios!");
  }

  const usuario = {
    username,
    avatar,
  };

  usuarios.push(usuario);

  res.send("OK");
});

app.post("/tweets", (req, res) => {
  const { username, tweet } = req.body;

  if (
    !username ||
    typeof username !== "string" ||
    !tweet ||
    typeof tweet !== "string"
  ) {
    return res.status(400).send("Todos os campos são obrigatórios!");
  }

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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
