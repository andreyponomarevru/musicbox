CREATE TABLE IF NOT EXISTS tyear (
  PRIMARY KEY (tyear_id),
  tyear_id        integer            GENERATED ALWAYS AS IDENTITY,
  tyear           smallint,

  UNIQUE (tyear)
);



CREATE TABLE IF NOT EXISTS extension (
  PRIMARY KEY (extension_id),
  extension_id     integer         GENERATED ALWAYS AS IDENTITY,
  name             varchar(200)    NOT NULL,

  UNIQUE (name),
  CHECK (name != '')
);



CREATE TABLE IF NOT EXISTS track (
  PRIMARY KEY (track_id),

  track_id         integer        GENERATED ALWAYS AS IDENTITY,
  tyear_id         integer,
  extension_id     integer,

  album            varchar(200),
  disk_no          smallint,
  track_no         smallint,
  title            varchar(200),
  bitrate          numeric,
  duration         numeric,
  bpm              integer,
  file_path        varchar(255)  NOT NULL,

  UNIQUE (file_path),
  CHECK (file_path != ''),

  FOREIGN KEY (tyear_id) REFERENCES tyear (tyear_id) 
    ON DELETE RESTRICT,
  FOREIGN KEY (extension_id) REFERENCES extension (extension_id)
    ON DELETE RESTRICT
);



CREATE TABLE IF NOT EXISTS genre (
  PRIMARY KEY (genre_id),
  genre_id         integer       GENERATED ALWAYS AS IDENTITY,
  name             varchar(200),

  UNIQUE (name)
);



CREATE TABLE IF NOT EXISTS track_genre (
  PRIMARY KEY (track_id, genre_id),
  track_id         integer,
  genre_id         integer,

  FOREIGN KEY (track_id) REFERENCES track (track_id)
    ON DELETE CASCADE,
  FOREIGN KEY (genre_id) REFERENCES genre (genre_id)
    ON DELETE RESTRICT
);



CREATE TABLE IF NOT EXISTS artist (
  PRIMARY KEY (artist_id),
  artist_id       integer        GENERATED ALWAYS AS IDENTITY,
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
  label_id          integer       GENERATED ALWAYS AS IDENTITY,
  name              varchar(200),

  UNIQUE (name)
);



CREATE TABLE IF NOT EXISTS track_label (
  PRIMARY KEY (track_id, label_id),
  track_id          integer       NOT NULL,
  label_id          integer       NOT NULL,
  
  FOREIGN KEY (track_id) REFERENCES track (track_id)
    ON DELETE CASCADE,
  FOREIGN KEY (label_id) REFERENCES label (label_id)
    ON DELETE RESTRICT
);