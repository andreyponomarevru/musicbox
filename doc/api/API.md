# MusicBox API Doc

## General Information

Root: `/api`

### Pagination

- `GET /tracks?sort=title|year|artist,desc|asc&page=:number&limit=:number` - retrieve the specific page of results, limiting the number of tracks per page and sorting by specific column

  ```shell
  curl --request DELETE \
       --header "content-type: application/json" \
       --url "musicbox.com:8000/api/tracks?page=2&limit=5"

  curl --request DELETE \
       --header "content-type: application/json" \
       --url "musicbox.com:8000/api/tracks?sort=year,desc&page=2&limit=50"
  ```

## Database

### Track

- `GET /tracks` - get all tracks
- `POST /tracks` - create a new track. `POST` request must containt the following object:

  ```shell
  curl --request POST \
       --header "content-type: application/json" \
       --url "musicbox.com:8000/api/tracks" \
       --data '{ "filePath": "./file/path.flac",
                 "coverPath": "cover/path.jpeg",
                 "extension": "flac",
                 "artist": ["Aya", "Sade"],
                 "duration": 4.25,
                 "bitrate": 320,
                 "year": 1998,
                 "trackNo": 5,
                 "title": "Track Title",
                 "album": "Album Name",
                 "diskNo": null,
                 "label": "Label Name",
                 "genre": ["House", "Jazz", "Soul"]
               }'

  # `artist` and `genre` also accept empty arrays
  ```

- `PUT /tracks` - _not available_
- `DELETE /tracks` - delete all trackes

- `GET /tracks/:id` - get a track
- `PUT /tracks/:id` - update tracks. `PUT` request must contain the same object as the `POST` request
- `DELETE /tracks/:id` - delete a track

- `GET /tracks?page=:number&limit=:number` - retrieve the specific page of results, limiting the number of tracks per page
  ```shell
  curl --request DELETE \
       --header "content-type: application/json" \
       --url "musicbox.com:8000/api/tracks?page=2&limit=5"
  ```

### Year

- `GET /years` - list all years

### Year Releases

### Genre

- `GET /genres` - list all genres

### Genre Releases

### Artist

- `GET /artists` - list all artists
  **Response 200**
  **Response 404**

- `GET /artists/{artist_id}` - get an artist
  **Parameters**
  - **artist_id** - `number` (required) - example: `258` - the artist ID
    **Response 200**
    **Response 404**

### Artist Releases

### Label

- `GET /labels` - list all labels

- `GET /labels/{label_id}` - get a label
  **Parameters**
  - **label_id** - `number` (required) - example: `1` - the label ID

### Label Releases

### Database Stats

- `GET /stats` - get music library statistics (total number of tracks, artists, genres, ...)

## Search

This endpoint accepts pagination parameters.

- `GET /api/search?artist=aya&year=2004&genre=soul&genre=house&label=naked+music+recordings`

## Other

### Users

- `POST /users` - create a new user

  ```shell
  curl --request POST \
       --header "content-type: application/json" \
       --url "musicbox.com:8000/api/users" \
       --data '{ "name": "John Malkovich",
                 "settings": { "isLibLoaded": true }
               }'
  ```

- `GET /users/:id`- retrieve user by id
