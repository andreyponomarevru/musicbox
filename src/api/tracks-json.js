// API mist always return 'year' prop as a string with a single year
// Right: "2006"
// Wrong: "2006/2007"
// Wrong: 2006

const tracks = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
    id: 5,
    artwork:
      "https://img.discogs.com/rroaD8mu18B4IK6YfSNbWAGpZlU=/fit-in/600x605/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-438159-1228317047.jpeg.jpg",
    year: "1997",
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
    id: 6,
    artwork:
      "https://img.discogs.com/VYjpJEjXV2dVz7DSCopR9kcEVR4=/fit-in/600x527/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-530753-1183404527.jpeg.jpg",
    year: "1997",
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
    id: 7,
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
    id: 8,
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
    id: 9,
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
    id: 10,
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
    id: 11,
    artwork:
      "https://img.discogs.com/IKqz5A2Ud6OnDoZCG9gVqEO-FMc=/fit-in/600x526/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-249174-1305114295.jpeg.jpg",
    year: "1975",
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
    id: 12,
    artwork:
      "https://img.discogs.com/IKqz5A2Ud6OnDoZCG9gVqEO-FMc=/fit-in/600x526/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-249174-1305114295.jpeg.jpg",
    year: "2001",
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
    id: 13,
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
  },

  {
    id: 14,
    artwork:
      "https://img.discogs.com/IKqz5A2Ud6OnDoZCG9gVqEO-FMc=/fit-in/600x526/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-249174-1305114295.jpeg.jpg",
    year: "2002",
    number: 8,
    artist: ["The Timewriter"],
    title: "When Stars Collide",
    album: "Diary Of A Lonely Sailor - CD, Album",
    label: "Plastic City",
    genre: ["House"],
    bitrate: "2400kbps",
    length: "4:32",
    codec: "FLAC"
  },

  {
    id: 15,
    artwork:
      "https://img.discogs.com/IKqz5A2Ud6OnDoZCG9gVqEO-FMc=/fit-in/600x526/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-249174-1305114295.jpeg.jpg",
    year: "1987",
    number: 8,
    artist: ["Joe Smooth"],
    title: "Promised Land",
    album: "Various ‎– Back To Love - 2 × CD, Compilation",
    label: "Hed Kandi",
    genre: ["House", "House - Garage"],
    bitrate: "2400kbps",
    length: "4:32",
    codec: "FLAC"
  },

  {
    id: 16,
    artwork:
      "https://img.discogs.com/IKqz5A2Ud6OnDoZCG9gVqEO-FMc=/fit-in/600x526/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-249174-1305114295.jpeg.jpg",
    year: "1987",
    number: 8,
    artist: ["Joe Smooth"],
    title: "Promised Land",
    album: "The Promised Land - Single",
    label: "D.J. International Records",
    genre: ["House", "House - Garage"],
    bitrate: "2400kbps",
    length: "4:32",
    codec: "FLAC"
  },

  {
    id: 17,
    artwork:
      "https://img.discogs.com/IKqz5A2Ud6OnDoZCG9gVqEO-FMc=/fit-in/600x526/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-249174-1305114295.jpeg.jpg",
    year: "2001",
    number: 8,
    artist: ["Miguel Migs", "Leedia"],
    title: "Mi Destino (Migs Summer Delight Mix)",
    album: "Various ‎– Beach House 2",
    label: "Hed Kandi",
    genre: ["House", "House - Garage"],
    bitrate: "2400kbps",
    length: "4:32",
    codec: "FLAC"
  },

  {
    id: 18,
    artwork:
      "https://img.discogs.com/IKqz5A2Ud6OnDoZCG9gVqEO-FMc=/fit-in/600x526/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-249174-1305114295.jpeg.jpg",
    year: "1989",
    number: 8,
    artist: ["Fresh 4"],
    title: "Wishing On A Star",
    album: "Various ‎– Back To Love 03.02 - 2 × CD, Compilation",
    label: "Hed Kandi",
    genre: ["R&B, Hip-Hop"],
    bitrate: "2400kbps",
    length: "4:32",
    codec: "FLAC"
  }
];

export default tracks;
