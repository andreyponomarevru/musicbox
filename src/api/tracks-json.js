const tracks = [
  {
    artwork:
      "https://img.discogs.com/rroaD8mu18B4IK6YfSNbWAGpZlU=/fit-in/600x605/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-438159-1228317047.jpeg.jpg",
    year: "1975",
    number: 1,
    artist: ["Rufus & Chaka Khan", "Aural Float"],
    title: "Fool's Paradise",
    album: "Rufus Featuring Chaka Khan",
    label: "Geffen Records",
    genre: ["Disco", "Soul, Funk, Jazz"],
    bitrate: "320kbps",
    length: "5:24",
    codec: "MP3"
  },
  {
    artwork:
      "https://img.discogs.com/VYjpJEjXV2dVz7DSCopR9kcEVR4=/fit-in/600x527/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-530753-1183404527.jpeg.jpg",
    year: "2005",
    number: null,
    artist: ["Aural Float"],
    title: "Still Here",
    album: "Beautiful Someday",
    label: "Elektrolux",
    genre: ["Downtempo", "Ambient", "Breakbeat, Jungle, Drum n Bass"],
    bitrate: "2400kbps",
    length: "6:35",
    codec: "FLAC"
  },
  {
    artwork:
      "https://img.discogs.com/KGT5rjL_09xX5_SVH17dmCA2YQo=/fit-in/500x500/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-7327321-1438982439-9653.jpeg.jpg",
    year: "2015",
    number: 7,
    artist: ["Julio Bashmore"],
    title: "Let Me Be Your Weakness",
    album: "Knockin' Boots",
    label: "Broadwalk Records",
    genre: ["House"],
    bitrate: "2400kbps",
    length: "4:15",
    codec: "FLAC"
  },
  {
    artwork:
      "https://img.discogs.com/IKqz5A2Ud6OnDoZCG9gVqEO-FMc=/fit-in/600x526/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-249174-1305114295.jpeg.jpg",
    year: "2000",
    number: 2,
    artist: ["Kylie Minogue", "DJ Spiller"],
    title: "Spinning Around (Sharp Vocal Mix)",
    album: "Spinning Around",
    label: "Parlophone",
    genre: ["House", "Pop", "Disco"],
    bitrate: "2400kbps",
    length: "7:06",
    codec: "FLAC"
  },
  {
    artwork:
      "https://img.discogs.com/rroaD8mu18B4IK6YfSNbWAGpZlU=/fit-in/600x605/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-438159-1228317047.jpeg.jpg",
    year: "1997/1998",
    number: 1,
    artist: ["The Starseeds"],
    title: "Sonne, Mond Und Sterne",
    album: "Parallel Life - CD, Album",
    label: "Never Records",
    genre: ["Ambient", "Downtempo"],
    bitrate: "320kbps",
    length: "4:32",
    codec: "MP3"
  },
  {
    artwork:
      "https://img.discogs.com/VYjpJEjXV2dVz7DSCopR9kcEVR4=/fit-in/600x527/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-530753-1183404527.jpeg.jpg",
    year: "1997/1998",
    number: 7,
    artist: ["The Starseeds"],
    title: "Subspace Radio Signals",
    album: "Parallel Life - CD, Album",
    label: "Never Records",
    genre: ["Ambient"],
    bitrate: "2400kbps",
    length: "7:05",
    codec: "FLAC"
  },

  {
    artwork:
      "https://img.discogs.com/KGT5rjL_09xX5_SVH17dmCA2YQo=/fit-in/500x500/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-7327321-1438982439-9653.jpeg.jpg",
    year: "1982",
    number: null,
    artist: ["Imagination"],
    title: "Beautiful Summer",
    album: "All Night Long - Album",
    label: "Capitol Records",
    genre: ["Disco"],
    bitrate: "2400kbps",
    length: "5:48",
    codec: "FLAC"
  },
  {
    artwork:
      "https://img.discogs.com/IKqz5A2Ud6OnDoZCG9gVqEO-FMc=/fit-in/600x526/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-249174-1305114295.jpeg.jpg",
    year: "2001",
    number: 2,
    artist: ["The Ones"],
    title: "Flawless (Original Mix)",
    album: "Flawless — CD, Single",
    label: "INK",
    genre: ["Disco", "Pop"],
    bitrate: "2400kbps",
    length: "5:51",
    codec: "FLAC"
  },

  {
    artwork:
      "https://img.discogs.com/IKqz5A2Ud6OnDoZCG9gVqEO-FMc=/fit-in/600x526/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-249174-1305114295.jpeg.jpg",
    year: "2013",
    number: 2,
    artist: ["7 Days Of Funk", "Snoop Dog"],
    title: "1Question?",
    album: "7 Days Of Funk (CD, Album)",
    label: "Stones Throw Records",
    genre: ["R&B, Hip-Hop"],
    bitrate: "2400kbps",
    length: "3:45",
    codec: "FLAC"
  },

  {
    artwork:
      "https://img.discogs.com/IKqz5A2Ud6OnDoZCG9gVqEO-FMc=/fit-in/600x526/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-249174-1305114295.jpeg.jpg",
    year: "2001",
    number: 6,
    artist: ["Ian O'brien"],
    title: "Vista Beleza",
    album: "A History Of Things To Come - CD, Album",
    label: "Peacefrog Records",
    genre: ["Ambient", "Soul, Funk, Jazz"],
    bitrate: "2400kbps",
    length: "5:05",
    codec: "FLAC"
  },

  {
    artwork:
      "https://img.discogs.com/IKqz5A2Ud6OnDoZCG9gVqEO-FMc=/fit-in/600x526/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-249174-1305114295.jpeg.jpg",
    year: "1975/2015",
    number: 2,
    artist: ["Ramsey Lewis"],
    title: "After Five",
    album: "Don't It Feel Good - Album",
    label: "Stax",
    genre: ["Disco", "Soul, Funk, Jazz"],
    bitrate: "2400kbps",
    length: "5:01",
    codec: "FLAC"
  },

  {
    artwork:
      "https://img.discogs.com/IKqz5A2Ud6OnDoZCG9gVqEO-FMc=/fit-in/600x526/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-249174-1305114295.jpeg.jpg",
    year: "2001/2002",
    number: 8,
    artist: ["Kylie Minogue"],
    title: "Fever",
    album: "Fever - CD, Album, Reissue",
    label: "Capitol Records",
    genre: ["Pop"],
    bitrate: "2400kbps",
    length: "5:01",
    codec: "FLAC"
  },

  {
    artwork:
      "https://img.discogs.com/IKqz5A2Ud6OnDoZCG9gVqEO-FMc=/fit-in/600x526/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-249174-1305114295.jpeg.jpg",
    year: "1997",
    number: 8,
    artist: ["Abacus"],
    title: "When I Fall (Restless Mix)",
    album: "Analog Trax Vol. 2 (Vinyl, EP)",
    label: "Guidance Recordings",
    genre: ["House"],
    bitrate: "2400kbps",
    length: "6:19",
    codec: "FLAC"
  }
];

export default tracks;
