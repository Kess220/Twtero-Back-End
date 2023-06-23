const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const usuarios = [];
const tweets = [];

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.post("/sign-up", (req, res) => {
  const { username, avatar } = req.body;

  if (
    !username ||
    !avatar ||
    typeof username !== "string" ||
    typeof avatar !== "string"
  ) {
    return res.status(400).send("Todos os campos são obrigatórios!");
  }

  const usuario = {
    username,
    avatar,
  };

  usuarios.push(usuario);

  res.status(201).send("OK");
});

app.post("/tweets", (req, res) => {
  const username = req.headers.user;
  const { tweet } = req.body;

  if (
    !username ||
    !tweet ||
    typeof username !== "string" ||
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

  res.status(201).send("OK");
});

app.get("/tweets", (req, res) => {
  const page = parseInt(req.query.page) || 1;

  if (page < 1 || isNaN(page)) {
    return res.status(400).send("Informe uma página válida!");
  }

  const startIndex = (page - 1) * 10;
  const endIndex = startIndex + 10;

  const tweetsResponse = tweets.slice(startIndex, endIndex).map((tweet) => {
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

app.get("/tweets/:username", (req, res) => {
  const { username } = req.params;

  if (!username || typeof username !== "string") {
    return res.status(400).send("Nome de usuário inválido!");
  }

  const tweetsUsuario = tweets.filter((tweet) => tweet.username === username);

  if (tweetsUsuario.length === 0) {
    return res.json([]);
  }

  const tweetsResponse = tweetsUsuario.map((tweet) => {
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
