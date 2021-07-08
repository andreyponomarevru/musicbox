--
-- MUSIC DATABASE
--

CREATE TABLE IF NOT EXISTS tyear (
  PRIMARY KEY (tyear_id),
  tyear_id        integer            GENERATED ALWAYS AS IDENTITY,
  tyear           smallint           NOT NULL,
  								UNIQUE (tyear)
);
CREATE INDEX tyear_tyear_idx ON tyear (tyear);


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
CREATE INDEX artist_name_idx ON artist (name);



CREATE TABLE IF NOT EXISTS release (
  PRIMARY KEY (release_id),
  release_id      integer           GENERATED ALWAYS AS IDENTITY,
  tyear_id        integer,
  label_id        integer,
  artist_id       integer, -- Artist name of the entire release
  cat_no          varchar(255),
									UNIQUE(cat_no),
								  CHECK (cat_no != ''),
  title           varchar(200),
	                CHECK (title != ''),
  cover_path      varchar(255)      NOT NULL,
	                CHECK (cover_path != ''),

  FOREIGN KEY (tyear_id) REFERENCES tyear (tyear_id)
    ON DELETE RESTRICT,
  FOREIGN KEY (label_id) REFERENCES label (label_id)
    ON DELETE RESTRICT,
  FOREIGN KEY (artist_id) REFERENCES artist (artist_id)
    ON DELETE RESTRICT
);
CREATE INDEX release_title_idx ON release (title);



CREATE TABLE IF NOT EXISTS track (
  PRIMARY KEY (track_id),
  track_id         integer          GENERATED ALWAYS AS IDENTITY,
  extension_id     integer,
  release_id       integer,

  disk_no          smallint,
  track_no         smallint,
  title            varchar(200)     NOT NULL,
									 CHECK (title != ''),
  bitrate          numeric,
  duration         numeric,
  bpm              integer,
  file_path        varchar(255),
									 UNIQUE (file_path),
  								 CHECK (file_path != ''),
  
  FOREIGN KEY (release_id) REFERENCES release (release_id) 
    ON DELETE CASCADE,
  FOREIGN KEY (extension_id) REFERENCES extension (extension_id)
    ON DELETE RESTRICT
);
CREATE INDEX track_title_idx ON track (lower(title) varchar_pattern_ops);



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
											 CHECK (name != ''),
  settings             jsonb
);



--
-- VIEWS
--

CREATE VIEW view_release AS
SELECT 
	re.release_id AS "id", 
  ty.tyear      AS "year", 
  ar.name       AS "artist", 
  re.title,
  la.name       AS "label",
  re.cat_no, 
  re.cover_path
FROM 
	release AS re
	INNER JOIN tyear AS ty
	 	 ON ty.tyear_id = re.tyear_id
	INNER JOIN label AS la
		 ON la.label_id = re.label_id
	INNER JOIN artist AS ar
		 ON ar.artist_id = re.artist_id
ORDER BY 
	ty.tyear DESC;



CREATE VIEW view_track AS
SELECT 
	tr.track_id, 
  tr.release_id,
  tr.track_no, 
  tr.disk_no, 
  ty.tyear      AS "year", 
  "track_artist", 
  tr.title      AS "track_title", 
  ar2.name      AS "release_artist",
  re.title      AS "release_title",
  re.cat_no,
  la.name       AS "label", 
  genre, 
  ex.name       AS "extension", 
  tr.bitrate, 
  tr.duration, 
  tr.bpm, 
  re.cover_path, 
  tr.file_path 
FROM (
	SELECT 
		tr.track_id, 
    tr.release_id,
    array_agg(DISTINCT ar.name) AS track_artist, 
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
	GROUP BY 
		tr.track_id 
	ORDER BY 
		title ASC
) AS track_metadata_1

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
ORDER BY 
	ty.tyear;



CREATE VIEW view_track_short AS
SELECT 
	tr.track_id, 
  tr.release_id,
  tr.file_path,
  ex.name       AS "extension",
  "artist", 
  tr.duration, 
  tr.bitrate, 
  tr.track_no, 
  tr.disk_no, 
  tr.title, 
  genre,     
  tr.bpm
FROM (
	SELECT 
		tr.track_id, 
		tr.release_id,
		array_agg(DISTINCT ar.name) AS "artist", 
		array_agg(DISTINCT ge.name) AS genre
	FROM 
		track AS tr 
		INNER JOIN track_genre AS tr_ge 
	  	 ON tr_ge.track_id = tr.track_id 
		INNER JOIN genre AS ge 
	 		 ON ge.genre_id = tr_ge.genre_id 
		INNER JOIN track_artist AS tr_ar 
			 ON tr_ar.track_id = tr.track_id 
		INNER JOIN artist AS ar 
			 ON ar.artist_id = tr_ar.artist_id 
	GROUP BY 
		tr.track_id 
	ORDER BY 
		title ASC
) AS track_metadata_1

INNER JOIN track AS tr 
   ON tr.track_id = track_metadata_1.track_id 
INNER JOIN release AS re 
   ON re.release_id = track_metadata_1.release_id 
INNER JOIN extension AS ex 
   ON ex.extension_id = tr.extension_id
INNER JOIN artist AS ar2
   ON re.artist_id = ar2.artist_id
ORDER BY 
	tr.track_no;


CREATE VIEW view_stats AS
SELECT 
	release_count.count::integer AS releases,
  track_count.count::integer AS tracks, 
  artist_count.count::integer AS artists,
  label_count.count::integer AS labels,
  genre_count.count::integer AS genres
FROM 
	(SELECT COUNT(*) FROM release) AS release_count,
  (SELECT COUNT(*) FROM track) AS track_count, 
  (SELECT COUNT(*) FROM artist WHERE artist.name != 'Various') AS artist_count, 
  (SELECT COUNT(*) FROM label) AS label_count,
  (SELECT COUNT(*) FROM genre) AS genre_count;