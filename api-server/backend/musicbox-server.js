// REST server

const tracks = require('./tracks');
const express = require('express');
const logger = require('morgan');

const app = express();

app.use(logger('dev'));

// send API responses


// get all tracks
// FIX: make it async
app.get('/', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.send(tracks);
});

// get track by ID
// FIX: make it async
app.get('/id=:id', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  // filter tracks
  // ...
  // and returned filtered tracks:
  res.send(...tracks.filter(track => {
    return track.id === Number(req.params.id);
  }));
});

// get all available years
// FIX: make it async
app.get('/years', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  const years = [];

  // imitate lomg-running backend task: for (let i = 0; i < 10e9; i++) {}
  tracks.forEach(track => {
    const year = track.year;
    if (!years.includes(year)) years.push(year);
  });

  years.sort();
  years.unshift("All");
  
  res.status(200).send(years);
});

// get all available genres
// FIX: make it async
app.get('/genres', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  const genres = [];

  tracks.forEach(track => {
    const trackGenres = track.genre;
    trackGenres.forEach(genre => {
      if (!genres.includes(genre)) genres.push(genre);
    });
  });
  genres.sort();
  genres.unshift("All");
  
 res.status(200).send(genres);
});

// get all available artists
// FIX: make it async
app.get('/artists', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  const artists = [];

  tracks.forEach(track => {
    const trackArtists = track.artist;
    trackArtists.forEach(artist => {
      if (!artists.includes(artist)) artists.push(artist);
    });
  });
  artists.sort();
  artists.unshift("All");
  
 res.status(200).send(artists);
});

// get all available albums
// FIX: make it async
app.get('/albums', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  const albums = [];

  tracks.forEach(track => {
    const album = track.album;
    if (!albums.includes(album)) albums.push(album);
  });
  albums.sort();
  albums.unshift("All");
  
 res.status(200).send(albums);
});

// get all available labels
// FIX: make it async
app.get('/labels', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  const labels = [];
  
  tracks.forEach(track => {
    const label = track.label;
    if (!labels.includes(label)) labels.push(label);
  });
  labels.sort();
  labels.unshift("All");
  
 res.status(200).send(labels);
});

//

app.listen(process.env.SERVERPORT);
