--
-- MUSIC DATABASE
--

CREATE TABLE IF NOT EXISTS tyear (
  PRIMARY KEY (tyear_id),
  tyear_id        integer            GENERATED ALWAYS AS IDENTITY,
  tyear           smallint           NOT NULL,

  UNIQUE (tyear)
);



CREATE TABLE IF NOT EXISTS extension (
  PRIMARY KEY (extension_id),
  extension_id     integer           GENERATED ALWAYS AS IDENTITY,
  name             varchar(50)       NOT NULL,

  UNIQUE (name),
  CHECK (name != '')
);



CREATE TABLE IF NOT EXISTS label (
  PRIMARY KEY (label_id),
  label_id          integer        GENERATED ALWAYS AS IDENTITY,
  name              varchar(200)   NOT NULL,

  UNIQUE (name),
  CHECK (name != '')
);



CREATE TABLE IF NOT EXISTS artist (
  PRIMARY KEY (artist_id),
  artist_id       integer          GENERATED ALWAYS AS IDENTITY,
  name            varchar(200)     NOT NULL,

  UNIQUE (name),
  CHECK (name != '')
);



CREATE TABLE IF NOT EXISTS release (
  PRIMARY KEY (release_id),

  release_id      integer           GENERATED ALWAYS AS IDENTITY,
  tyear_id        integer,
  label_id        integer,
  artist_id       integer, -- Artist name of the entire release
  cat_no          varchar(255),
  title           varchar(200),
  cover_path      varchar(255)      NOT NULL,

  UNIQUE(cat_no),
  CHECK (cat_no != ''),
  CHECK (title != ''),
  CHECK (cover_path != ''),

  FOREIGN KEY (tyear_id) REFERENCES tyear (tyear_id)
    ON DELETE RESTRICT,
  FOREIGN KEY (label_id) REFERENCES label (label_id)
    ON DELETE RESTRICT,
  FOREIGN KEY (artist_id) REFERENCES artist (artist_id)
    ON DELETE RESTRICT
);



CREATE TABLE IF NOT EXISTS track (
  PRIMARY KEY (track_id),

  track_id         integer          GENERATED ALWAYS AS IDENTITY,
  extension_id     integer,
  release_id       integer,

  disk_no          smallint,
  track_no         smallint,
  title            varchar(200)     NOT NULL,
  bitrate          numeric,
  duration         numeric,
  bpm              integer,
  file_path        varchar(255),

  UNIQUE (file_path),
  CHECK (file_path != ''),
  CHECK (title != ''),

  FOREIGN KEY (release_id) REFERENCES release (release_id) 
    ON DELETE CASCADE,
  FOREIGN KEY (extension_id) REFERENCES extension (extension_id)
    ON DELETE RESTRICT
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



CREATE TABLE IF NOT EXISTS genre (
  PRIMARY KEY (genre_id),
  genre_id         integer          GENERATED ALWAYS AS IDENTITY,
  name             varchar(200)     NOT NULL,

  UNIQUE (name),
  CHECK (name != '')
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



--
-- USERS
--

CREATE TABLE IF NOT EXISTS appuser (
  PRIMARY KEY (appuser_id),
  appuser_id           integer        GENERATED ALWAYS AS IDENTITY,
  name                 varchar(50)    NOT NULL,
  settings             jsonb,

  CHECK (name != '')
);



--
-- VIEWS
--

CREATE VIEW view_release AS
SELECT re.release_id AS "id", 
       ty.tyear      AS "year", 
       ar.name       AS "artist", 
       re.title,
       la.name       AS "label",
       re.cat_no     AS "catNo", 
       re.cover_path AS "coverPath" 
  FROM release AS re
 INNER JOIN tyear AS ty
    ON ty.tyear_id = re.tyear_id
 INNER JOIN label AS la
    ON la.label_id = re.label_id
 INNER JOIN artist AS ar
    ON ar.artist_id = re.artist_id
 ORDER BY ty.tyear DESC;



CREATE VIEW view_release_short AS
SELECT re.release_id AS "id", 
       ty.tyear      AS "year", 
       ar.name       AS "artist", 
       re.title,
       re.cover_path AS "coverPath" 
  FROM release AS re
 INNER JOIN tyear AS ty
    ON ty.tyear_id = re.tyear_id
 INNER JOIN label AS la
    ON la.label_id = re.label_id
 INNER JOIN artist AS ar
    ON ar.artist_id = re.artist_id
 ORDER BY ty.tyear DESC;



CREATE VIEW view_track AS
SELECT tr.track_id   AS "trackId", 
       tr.release_id AS "releaseId",
       tr.track_no   AS "trackNo", 
       tr.disk_no    AS "diskNo", 
       ty.tyear      AS "year", 
       "trackArtist", 
       tr.title      AS "trackTitle", 
       ar2.name      AS "releaseArtist",
       re.title      AS "releaseTitle",
       re.cat_no     AS "catNo",
       la.name       AS "label", 
       genre, 
       ex.name       AS "extension", 
       tr.bitrate, 
       tr.duration, 
       tr.bpm, 
       re.cover_path AS "coverPath", 
       tr.file_path  AS "filePath" 
  FROM (SELECT tr.track_id, 
               tr.release_id,
               array_agg(DISTINCT ar.name) AS "trackArtist", 
               array_agg(DISTINCT ge.name) AS genre
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
          ORDER BY title ASC) AS track_metadata_1
INNER JOIN track AS tr 
  ON tr.track_id = track_metadata_1.track_id 
INNER JOIN release AS re 
  ON re.release_id = track_metadata_1.release_id 
INNER JOIN tyear AS ty
  ON ty.tyear_id = re.tyear_id
INNER JOIN label AS la
  ON la.label_id = re.label_id
INNER JOIN extension AS ex 
  ON ex.extension_id = tr.extension_id
INNER JOIN artist AS ar2
  ON re.artist_id = ar2.artist_id
ORDER BY ty.tyear;




CREATE VIEW view_stats AS
SELECT release_count.count::integer AS releases,
       track_count.count::integer AS tracks, 
       artist_count.count::integer AS artists,
       label_count.count::integer AS labels,
       genre_count.count::integer AS genres
  FROM (SELECT COUNT(*) FROM release) AS release_count,
       (SELECT COUNT(*) FROM track) AS track_count, 
       (SELECT COUNT(*) FROM artist) AS artist_count, 
       (SELECT COUNT(*) FROM label) AS label_count,
       (SELECT COUNT(*) FROM genre) AS genre_count;



CREATE VIEW view_year_stats AS 
SELECT ty.tyear_id AS "id", 
       ty.tyear AS "name", 
       COUNT(*)::integer AS "tracks"
  FROM track AS tr
    INNER JOIN release AS re 
      ON tr.release_id = re.release_id
    INNER JOIN tyear AS ty 
      ON ty.tyear_id = re.tyear_id 
 GROUP BY ty.tyear_id 
 ORDER BY ty.tyear DESC;



CREATE VIEW view_genre_stats AS 
SELECT ge.genre_id AS "id", 
       ge.name AS "name", 
       COUNT(*)::integer AS "tracks"
  FROM track AS tr
    INNER JOIN track_genre AS tr_ge
      ON tr.track_id = tr_ge.track_id
    INNER JOIN genre AS ge
      ON tr_ge.genre_id = ge.genre_id 
 GROUP BY ge.genre_id 
 ORDER BY ge.name ASC;



CREATE VIEW view_artist_stats AS 
SELECT ar.artist_id AS "id", 
       ar.name AS "name", 
       COUNT(*)::integer AS "tracks"
  FROM track AS tr
    INNER JOIN track_artist AS tr_ar
      ON tr.track_id = tr_ar.track_id
    INNER JOIN artist AS ar
      ON tr_ar.artist_id = ar.artist_id 
 GROUP BY ar.artist_id 
 ORDER BY ar.name ASC;



CREATE VIEW view_label_stats AS 
SELECT la.label_id AS "id", 
       la.name AS "name",
       COUNT(*)::integer AS "tracks"
  FROM release AS re
    INNER JOIN track AS tr
      ON tr.release_id = re.release_id
    INNER JOIN label AS la
      ON re.label_id = la.label_id 
 GROUP BY la.label_id 
 ORDER BY la.name ASC;

