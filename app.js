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
  if (!searchResult) {
    res.status(404).send("Not found");
  }

  res.send(searchResult);
});

app.get("/narrowsearch/:id", async (req, res, next) => {
  const data = decodeURIComponent(req.params.id);
  let isViral;
  if (data.indexOf('[') != -1) {
    // convert to array
    const idArr = data.split(',')
    idArr.forEach((item, index) => {
      idArr[index] = item.replace(/[^a-z0-9]/gi, '')
    })
    //console.log(idArr);
    isViral = await spotify.checkViral(idArr);
  } else {
    console.log("no duplicates")
    isViral = await spotify.checkViral(req.params.id);
  }
  //console.log("received: ", req.params.id);

  

  res.send(isViral);
})

app.listen(port, () => {
  console.log(`Webserver listening on port ${port}`);
});
