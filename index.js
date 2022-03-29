const express = require("express");
const app = express();
var cors = require("cors");
const port = 3001;
const morgan = require("morgan");
const spotify = require("./spotify.js");

spotify.connectSpotify();

app.use(cors());
app.use(morgan("tiny"));

app.get("/:term", async (req, res, next) => {
  const data = {
    viral: Math.random() >= 0.5,
  };

  //console.log("req.params.term: ", req.params.term);
  //spotify.getPlaylist(req.params.term);
  const searchResult = await spotify.searchSong(req.params.term);
  console.log("inside get ", searchResult);

  res.send(searchResult);
});

app.listen(port, () => {
  console.log(`Webserver listening on port ${port}`);
});
