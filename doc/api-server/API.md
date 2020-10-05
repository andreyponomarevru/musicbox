# MusicBox API Doc

Root: `/api`

## Endpoints

- Tracks

  - `GET /tracks` - list all tracks [array]
  - `POST /tracks` - create a new track
  - `PUT /tracks` (or `PATCH`) - batch update tracks
  - `DELETE /tracks` - delete all trackes

  - `GET /tracks/:id` - retrieve track by ID [object]
  - `PUT /tracks/:id` (or `PATCH`) - update tracks by ID
  - `DELETE /tracks/id` - delete track by ID

- Years

  - `GET /years` - list all years [array]
  - ``

- Genres

  - `GET /genres` - list all genres [array]

- Artists

  - `GET /artists` - list all artists [array]

- Labels

  - `GET /labels` - list all labels [array]

## Pagination

- `tracks?limit=25&offset=50` - not sure if needed

## Query parameters

- `tracks?year=1987&genre=ambient&genre=house&genre=drumnbass`
- `tracks?artist=blue-six`
- `tracks?label=naked-music-recordings`
