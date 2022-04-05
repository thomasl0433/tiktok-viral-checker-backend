const request = require("request");
const axios = require("axios");
const fs = require("fs");
const arrayToTxtFile = require("array-to-txt-file");
require("dotenv").config({ path: "./config.env" });

const playlistIDs = [
  "2FjmnBrint8vO0GCtXZYUY",
  "7grPEcWuJGbspFgA3Yhvn4",
  "37i9dQZF1DX2L0iB23Enbq",
  "0Amrw6DKPvruVyW4vqoptr",
  "2wJ7BKBlkP3UaKrH0Ut1Dd",
  "4yeF8WVBDCQV2VEQWZxaZJ",
  "620chE9ZFZEIwHwtCvNDLN",
];

const viralPlaylists = [];

let token;

var authOptions = {
  url: "https://accounts.spotify.com/api/token",
  headers: {
    Authorization:
      "Basic " +
      new Buffer.from(
        process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
      ).toString("base64"),
  },
  form: {
    grant_type: "client_credentials",
  },
  json: true,
};

function connectSpotify() {
  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      token = body.access_token;
      console.log(body);
      getPlaylist()
    } else {
      console.log("Didnt work for auth");
    }
  });
}

const searchSong = async (song) => {
  //console.log(viralPlaylists)
  let query = encodeURIComponent(song);

  const url = `https://api.spotify.com/v1/search?q=track%3A${query}&type=track&include_external=true`;

  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    .then(async (res) => {
      const tracks = await res.data.tracks.items;
      let out = []
      tracks.forEach(track => {
        const temp = {
          name: track.name,
          artist: track.artists[0].name,
          id: track.id
        }
        //console.log(track.artists[0].name)
        out.push(temp);
      })
      //out = checkDuplicates(out)
      return out;
    })
    .catch(err => {
      console.log(err);
    });
};


const checkViral = async (id) => {
  let out = false;
  const temp = viralPlaylists[0].map(e => e.id);
  
  if (Array.isArray(id)) {
    id.forEach(item => {
      //console.log(item)
      if (temp.includes(item)) {
        out = true;
        console.log("MATCH")
      }
    })
  } else {
    console.log('one arg')
    viralPlaylists[0].forEach((song) => {
      if (song.id == id) {
        // song is viral
        console.log("MATCH")
        out = true;
      }
    })
  }
  //console.log(viralPlaylists);
  return out;
}

const getPlaylist = async (term) => {
  const output = [];

  // for each playlist in playlistIDs
  playlistIDs.forEach(async (playlistID) => {
    const urlPlaylist = `https://api.spotify.com/v1/playlists/${playlistID}`;
    
    // get response
    axios
      .get(urlPlaylist, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        // loop thru each track in the playlist

        const songs = res.data.tracks.items;
        // for each song in the playlist
        songs.forEach((song) => {
          if (song.track == null) {
            // do nothing
          } else {
            //console.log("not null")
            output.push({
              id: song.track.id,
            });
          }
        });
      })
      .catch((error) => {
        //console.log("Request Didnt work")
        console.error(error);
      });
      //console.log(output)
  });
  // make request to spotify API
  // const url = 'https://api.spotify.com/v1/tracks/2TpxZ7JUBn3uw46aR7qd6V';
  // const url2 = "https://api.spotify.com/v1/search?q=track%3ARoxanne&type=track&include_external=true";
  // const oldUrl = 'https://api.spotify.com/v1/search?q=tiktok';
  //console.log(res.data.tracks.items[0].track.name + " " + res.data.tracks.items[0].track.id)
  viralPlaylists.push(output);
};

module.exports = { connectSpotify, getPlaylist, searchSong, checkViral };
