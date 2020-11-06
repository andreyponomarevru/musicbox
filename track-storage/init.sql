CREATE TABLE IF NOT EXISTS tyear (
  PRIMARY KEY (tyear_id),
  tyear_id        integer            GENERATED ALWAYS AS IDENTITY,
  tyear           smallint,

  UNIQUE (tyear)
);



CREATE TABLE IF NOT EXISTS extension (
  PRIMARY KEY (extension_id),
  extension_id     integer           GENERATED ALWAYS AS IDENTITY,
  name             varchar(50),

  UNIQUE (name),
  CHECK (name != '')
);



CREATE TABLE IF NOT EXISTS track (
  PRIMARY KEY (track_id),

  track_id         integer          GENERATED ALWAYS AS IDENTITY,
  tyear_id         integer,
  label_id         integer,
  extension_id     integer,

  album            varchar(200),
  disk_no          smallint,
  track_no         smallint,
  title            varchar(200),
  bitrate          numeric,
  duration         numeric,
  bpm              integer,
  picture_path     varchar(255),
  file_path        varchar(255)  NOT NULL,

  UNIQUE (picture_path),

  UNIQUE (file_path),
  CHECK (file_path != ''),

  FOREIGN KEY (tyear_id) REFERENCES tyear (tyear_id) 
    ON DELETE RESTRICT,
  FOREIGN KEY (extension_id) REFERENCES extension (extension_id)
    ON DELETE RESTRICT
);



CREATE TABLE IF NOT EXISTS genre (
  PRIMARY KEY (genre_id),
  genre_id         integer          GENERATED ALWAYS AS IDENTITY,
  name             varchar(200),

  UNIQUE (name)
);



CREATE TABLE IF NOT EXISTS track_genre (
  PRIMARY KEY (track_id, genre_id),
  track_id         integer        NOT NULL,
  genre_id         integer        NOT NULL,

  FOREIGN KEY (track_id) REFERENCES track (track_id)
    ON DELETE CASCADE,
  FOREIGN KEY (genre_id) REFERENCES genre (genre_id)
    ON DELETE RESTRICT
);



CREATE TABLE IF NOT EXISTS artist (
  PRIMARY KEY (artist_id),
  artist_id       integer          GENERATED ALWAYS AS IDENTITY,
  name            varchar(200),

  UNIQUE (name)
);



CREATE TABLE IF NOT EXISTS track_artist (
  PRIMARY KEY (track_id, artist_id),
  track_id        integer        NOT NULL,
  artist_id       integer        NOT NULL,

  FOREIGN KEY (track_id) REFERENCES track (track_id)
    ON DELETE CASCADE,
  FOREIGN KEY (artist_id) REFERENCES artist (artist_id)
    ON DELETE RESTRICT
);



CREATE TABLE IF NOT EXISTS label (
  PRIMARY KEY (label_id),
  label_id          integer        GENERATED ALWAYS AS IDENTITY,
  name              varchar(200),

  UNIQUE (name)
);

--

CREATE VIEW view_track AS

SELECT tr.track_id AS "trackId", 
       tr.track_no AS "trackNo", 
       tr.disk_no AS "diskNo", 
       ye.tyear AS "year", 
       artist, 
       tr.title, 
       tr.album, 
       la.name AS "label", 
       genre, 
       ex.name AS "extension", 
       tr.bitrate, 
       tr.duration, 
       tr.bpm, 
       tr.picture_path AS "picturePath", 
       tr.file_path AS "filePath" 
  FROM (SELECT tr.track_id, 
          -- convert null arrays ({null}) to empty arrays
          coalesce(
            array_agg(DISTINCT ar.name) FILTER (WHERE ar.name IS NOT NULL), 
            '{}') AS artist,
          coalesce(
            array_agg(DISTINCT ge.name) FILTER (WHERE ge.name IS NOT NULL), 
            '{}') AS genre
          FROM track AS tr 
          INNER JOIN track_genre AS tr_ge 
            ON tr_ge.track_id = tr.track_id 
          INNER JOIN genre AS ge 
            ON ge.genre_id = tr_ge.genre_id 
          INNER JOIN track_artist AS tr_ar 
            ON tr_ar.track_id = tr.track_id 
          INNER JOIN artist AS ar 
            ON ar.artist_id = tr_ar.artist_id 
          GROUP BY tr.track_id 
          ORDER BY title ASC) AS track_id_and_artist_and_genre 

INNER JOIN track AS tr 
  ON tr.track_id = track_id_and_artist_and_genre.track_id 
INNER JOIN tyear AS ye 
  ON tr.tyear_id = ye.tyear_id 
INNER JOIN label AS la 
  ON la.label_id = tr.label_id 
INNER JOIN extension AS ex 
  ON ex.extension_id = tr.extension_id
ORDER BY ye.tyear;

--

CREATE VIEW view_statistics AS

SELECT track_count.count AS tracks, 
       artist_count.count AS artists,
       album_count.count AS albums,
       label_count.count AS labels,
       genre_count.count AS genres
  FROM (SELECT COUNT(*) FROM track) AS track_count, 
       (SELECT COUNT(*) FROM artist) AS artist_count, 
       (SELECT COUNT(*) FROM (SELECT DISTINCT ON (album) album FROM track) AS album_count) AS album_count,
       (SELECT COUNT(*) FROM label) AS label_count,
       (SELECT COUNT(*) FROM genre) AS genre_count;
