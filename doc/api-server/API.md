# MusicBox API Doc

Root: `/api`

## Endpoints

- **Tracks**

  - `GET /tracks` - list all tracks
  - `POST /tracks` - create a new track
  - `PUT /tracks` (or `PATCH`) - batch update tracks
  - `DELETE /tracks` - delete all trackes

  - `GET /tracks/:id` - retrieve track by ID
  - `PUT /tracks/:id` (or `PATCH`) - update tracks by ID
  - `DELETE /tracks/id` - delete track by ID

  - `GET /tracks?page=:number&limit=:number` - retrieve the specific page of results, limiting the number of tracks per page
    Example: `curl "musicbox.com:8000/api/tracks?page=2&limit=5"`

- **Years**

  - `GET /years` - list all years

- **Genres**

  - `GET /genres` - list all genres

- **Artists**

  - `GET /artists` - list all artists

- **Labels**
  - `GET /labels` - list all labels

## Query parameters

- `tracks?year=1987&genre=ambient&genre=house&genre=drumnbass`
- `tracks?artist=blue-six`
- `tracks?label=naked-music-recordings`
