# MusicBox API Doc

* root: `/api/`

* **`GET` requests:**
  * `tracks/` - list all tracks [array]
  * `tracks/256` - retrieve track 256 [object]
  * `tracks?year='1987'`
  * `tracks?genre=ambient&genre=house&genre=drumnbass`
  * `tracks?artist='bluesix'`
  * `tracks?label='nakedmusicrecordings'`
  
  * `tracks?limit=25&offset=50` - not sure if needed
  
  * bad idea - http://localhost:3002/id=n — get track by ID (`n` is a track ID (number)) [object]
  * http://localhost:3002/file_path=s — get track by ID (`s` is a track file path (string)) [object]


* `years/` — list all years [array]
* `genres/` — list all genres [array]
* `albums/` — list all albums [array]
* `artists/` — list all artists [array]
* `labels/` — list all labels [array]

* title
* bitrate
* duration
* bpm

* **`POST` requests:**
  * `/tracks` - create a new track
  * `/users/2841` - NOW APPLICABLE

* **`PUT` or `PATCH` request:**
  * `/tracks` - batch update tracks
  * `/track/256` - update tracks 256

* **`DELETE` request:**
  * `/tracks` - delete all trackes
  * `/tracks/256` - delete track 256
