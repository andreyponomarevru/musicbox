/*
How to delete unreferenced records

Tables used in this query: genre, track_genre

Suppose you deleted all tracks from `track` table in genre "House". The table `track_genre` won't contain records relating tracks to House genre anympre (cause you have ON DELETE CASCADE, so when you delete track, the record in track_genre automatically deleted too). But table `genre` will still contain the genre `House` and you won't be able to delete this genre as long as database has at least 1 track refering to this genre (cause you have ON DELETE RESTRICT). 

But when we deleted all tracks containing genre `House`, now there is no references to this genre from other tables, so now `ON DELETE RESTRICT` allows us to delete this genre.

So we need to join linking table `track_genre` with data table `genre` in order to find unmatched genres - these unmatched genres are the genres that have no references from any tracks i.e. we don't have tracks referencing these genres. So all these unmatched genres can be safely deleted (cause nothing references them hence ON DELETE RESTRICT allow us to delete them).

In subquery we retrieve the genre_id of all unmatched tracks and get smth like 

 genre_id 
----------
        2
        1
(2 rows)

and then we use IN operator to check whether subquery result tanle contains genre_id matching genre_id in our `genre` table.

So, here is the full query:

DELETE FROM genre 
 WHERE genre_id IN  
       (SELECT g.genre_id 
          FROM track_genre AS t_g 
               RIGHT JOIN genre AS g 
                  ON g.genre_id = t_g.genre_id 
               WHERE t_g.track_id IS NULL);

*/

-- -----------------------------------------------------------------------------



CREATE TABLE IF NOT EXISTS tyear (
  PRIMARY KEY (tyear_id),
  tyear_id        integer            GENERATED ALWAYS AS IDENTITY,
  tyear           smallint,

  UNIQUE (tyear)
);



CREATE TABLE IF NOT EXISTS extension (
  PRIMARY KEY (extension_id),
  extension_id     integer         GENERATED ALWAYS AS IDENTITY,
  name             varchar(100)    NOT NULL,

  UNIQUE (name),
  CHECK (name != '')
);

INSERT INTO extension (name)
VALUES ('flac', 'mp3');



CREATE TABLE IF NOT EXISTS album (
  PRIMARY KEY (album_id),
  album_id        integer          GENERATED ALWAYS AS IDENTITY,
  title           varchar(100)
);



CREATE TABLE IF NOT EXISTS track (
  PRIMARY KEY (track_id),

  track_id         integer        GENERATED ALWAYS AS IDENTITY,
  tyear_id         integer,
  album_id         integer,
  extension_id     integer,

  disk_no          smallint,
  track_no         smallint,
  title            varchar(100),
  comment          text,
  bitrate          numeric,
  duration         numeric,
  bpm              integer,
  sample_rate      integer,
  file_path        varchar(255)  NOT NULL,

  UNIQUE (file_path),
  CHECK (file_path != ''),

  FOREIGN KEY (tyear_id) REFERENCES tyear (tyear_id) 
    ON DELETE RESTRICT,
  FOREIGN KEY (album_id) REFERENCES album (album_id)
    ON DELETE RESTRICT,
  FOREIGN KEY (extension_id) REFERENCES extension (extension_id)
    ON DELETE RESTRICT
);



CREATE TABLE IF NOT EXISTS genre (
  PRIMARY KEY (genre_id),
  genre_id         integer       GENERATED ALWAYS AS IDENTITY,
  name             varchar(100),

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
  name            varchar(100),

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
  name              varchar(100),

  UNIQUE (name)
);



CREATE TABLE IF NOT EXISTS track_label (
  PRIMARY KEY (track_id, label_id),
  track_id          integer,
  label_id          integer,
  
  FOREIGN KEY (track_id) REFERENCES track (track_id)
    ON DELETE CASCADE,
  FOREIGN KEY (label_id) REFERENCES label (label_id)
    ON DELETE RESTRICT
);
/*

-- -----------------------------------------------------------------------------
/*
CREATE VIEW track_view AS 
SELECT tyear AS year, 
       a.name AS artist, 
       t.title, 
       alb.name AS album, 
       l.name AS label, 
       g.name AS genre, 
       c.name AS extension 
  FROM track AS t 
       INNER JOIN album AS alb 
          ON alb.album_id = t.album_id 
       INNER JOIN extension AS c 
          ON c.extension_id = t.extension_id 
       INNER JOIN track_label AS t_l 
          ON t_l.track_id = t.track_id 
       INNER JOIN label AS l 
          ON t_l.label_id = l.label_id 
       INNER JOIN track_genre AS t_g 
          ON t.track_id = t_g.track_id 
       INNER JOIN genre AS g 
          ON g.genre_id = t_g.genre_id 
       INNER JOIN track_artist AS t_a 
          ON t_a.track_id = t.track_id 
       INNER JOIN artist AS a 
          ON a.artist_id = t_a.artist_id 
       ORDER BY year ASC;
*/
