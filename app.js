const express = require("express");
const app = express();
var cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 3001;
const morgan = require("morgan");
const spotify = require("./spotify.js");

//dummy comment

spotify.connectSpotify();

app.use(cors());
app.use(morgan("tiny"));

app.get("/widesearch/:term", async (req, res, next) => {
  //console.log("req.params.term: ", req.params.term);
  //spotify.getPlaylist(req.params.term);
  const searchResult = await spotify.searchSong(req.params.term);
  //console.log("inside get ", searchResult);
  if (searchResult.length == 0) {
    res.status(404).send("Not found");
  }

  res.send(searchResult);
});

app.get("/narrowsearch/:id", async (req, res, next) => {
  //console.log("received: ", req.params.id);

  const isViral = await spotify.checkViral(req.params.id);

  res.send(isViral);
})

app.listen(port, () => {
  console.log(`Webserver listening on port ${port}`);
});
