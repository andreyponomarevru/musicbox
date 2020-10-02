# MusicBox API Doc

* http://localhost:3002 — get all tracks [array]

* bad idea - http://localhost:3002/id=n — get track by ID (`n` is a track ID (number)) [object]
* http://localhost:3002/file_path=s — get track by ID (`s` is a track file path (string)) [object]

* http://localhost:3002/years — get all available years [array]
* http://localhost:3002/genres — get all available genres [array]
* http://localhost:3002/albums — get all available albums [array]
* http://localhost:3002/artists — get all available artists [array]
* http://localhost:3002/labels — get all available labels [array]

* title
* bitrate
* duration
* bpm
