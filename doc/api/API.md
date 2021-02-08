# MusicBox API Doc

# General Information

Root: `/api`

For consistency, all API responses return the main data (tracks, releases, statistics) in the `results` property of the response object. The typical response object looks like this:

```
{
  metadata_prop: ...,
  metadata_prop: ...,
  ...
  results: [ {}, {}, ... ]
}

```

## Available Endpoints

- tracks
  - `GET /tracks`
  - `GET /tracks/:id`
  -
- releases
  - `GET /releases`
  - `POST /releases`
  - `DELETE /releases/:id`
  - `PUT /release/:id`
  - ``
- year
  - `GET /years`
- genres
  - `GET /genres`
- artists
  - `GET /artists`
- labels
  - `GET /labels`
- stats
  - `GET /stats`
  - `GET /stats/genres`
  - `GET /stats/artists`
  - `GET /stats/labels`
  - `GET /stats/years`
- search

## Pagination & Sorting

The API allows to retrieve the specific page of results, limiting the number of tracks per page and sorting by specific column.

Pagination is implemented using both the `Link` header of the HTTP message and by including pagination metadata in the JSON response object.

In the case of omitting all pagination and sorting parameters, the default values are applied.: `?page=1&limit=25&sort=year,desc`

### Parameters

| Name    | Type   | In   | Allowed values                                                                                                                                                                                                                                                                         | Description                                                                                                |
| ------- | ------ | ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `sort`  | string | path | You can sort releases by the `year`, `artist` and `title` column names. You can sort tracks by the following column names: `year`, `track-artist`, `track-title`, `release-artist`, `release-title`. For both tracks and releases you need to specify the sort order: `asc` or `desc`. | Format: `{column-name},{sort-order}`. Sort results by specific column and in ascending or descending order |
| `page`  | number | path |                                                                                                                                                                                                                                                                                        | Retrieve the specific page of results                                                                      |
| `limit` | number | path | `25`, `50`, `100`, `250`, `500`                                                                                                                                                                                                                                                        | Limit the number of tracks per page                                                                        |

### Examples

```shell
# Default params:
curl "musicbox.com:8000/api/tracks" # is the same as
curl "musicbox.com:8000/api/tracks?page=1&limit=25&sort=year,desc"
```

```shell
curl "musicbox.com:8000/api/tracks?page=2&limit=25?&sort=release-title,desc"
# Response:
{
  first_page: "/tracks?page=1"
  last_page: "/tracks?page=2"
  next_page: null
  page_number: 2
  previous_page: "/tracks?page=1"
  results: [{...}, {...}, ...]
  total_count: 37
  total_page: 2
}
```

```shell
curl "musicbox.com:8000/api/releases?sort=year,desc&page=1&limit=25"
# Response:
{
  first_page: "/releases?page=1"
  last_page: "/releases?page=2"
  next_page: "/releases?page=2"
  page_number: 1
  previous_page: null
  results: [{...}, {...}, ...]
  total_count: 27
  total_page: 2
}
```

# Reference

## Tracks

### Get all tracks

```
GET /tracks
```

#### Success response

- **Code**: 200

  **Content:**

  ```shell
  {
    "page_number":1,
    "total_page":2,
    "total_count":37,
    "previous_page":null,
    "next_page":"/tracks?page=2",
    "first_page":"/tracks?page=1",
    "last_page":"/tracks?page=2",
    "results": [
      {
        "filePath":"/music/03 - Expressing What Matters.mp3",
        "extension":"mp3",
        "trackArtist":["Disclosure"],
        "releaseArtist":"Disclosure",
        "duration":263.26204081632653,
        "bitrate":320000,
        "year":2020,
        "trackNo":3,
        "trackTitle":"Expressing What Matters",
        "releaseTitle":"New Album",
        "diskNo":2,
        "label":"Unknown",
        "genre":["House"],
        "coverPath":"/api/images/03_-_Expressing_What_Matters.jpeg",
        "catNo":null,
        "trackId":6,
        "releaseId":6
      },

      ...
    ]
  }
  ```

#### Error response

- **Code**:

  **Content**:

### Create a track

```
GET /tracks
```

#### Examples

```shell
curl --request POST \
     --header "content-type: application/json" \
     --dump-header - \
     --url "musicbox.com:8000/api/tracks" \
     --data '{
               "releaseId": 40,
               "trackNo": 1,
               "diskNo": 1,
               "artist": ["Test Track Artist 1", "Test Track Artist 2"],
               "title": "Test Track Title",
               "genre": ["Genre1", "Genre2"],
               "duration": 1111,
               "filePath": null,
               "extension": "flac",
               "bitrate": 320000
             }'
```

#### Success response

- **Code**: 201

  **Content:**

  ```shell
  Location: /tracks/47

  {
    filePath: null,
    extension: 'flac',
    artist: [ 'Test Track Artist 1', 'Test Track Artist 2' ],
    duration: 1111,
    bitrate: 320000,
    trackNo: 1,
    title: 'Test Track Title',
    diskNo: 1,
    genre: [ 'Genre1', 'Genre2' ],
    trackId: 49,
    releaseId: 40
  }
  ```

#### Error resposne

- **Code**: 400

  **Content:**

  ```shell
  {
    "errorCode":400,
    "message":"BadRequest",
    "more_info":"https://github.com/ponomarevandrey/musicbox"
  }
  ```

### Delete a track

```
DELETE /tracks/:id
```

#### Success response

#### Error response

- **Code**: 404

  **Content**:

  ```shell
  {
    "errorCode":404,
    "message":"NotFound",
    "more_info":"https://github.com/ponomarevandrey/musicbox"
  }
  ```

- **Code**: 422

  **Content**:

  ```shell
  {
    "errorCode":422,
    "message":"UnprocessableEntity",
    "more_info":"https://github.com/ponomarevandrey/musicbox"
  }
  ```

## Releases

### Get a release

```
GET /releases/:id
```

#### Success response

- **Code**: 200

  **Content:**

#### Error response

- **Code**:

  **Content**:

### Create a release

```
POST /releases
```

#### Examples

Include all release tracks in the `tracks` property of the requests object. Sending a request with the `tracks` property as an empty array will result in error `422`. If you will omit some properties of the release or tracks, they will be replaced by default values.

```shell
# Default values

filePath: null,
extension: "Unknown",
trackArtist: ["Unknown"],
releaseArtist: "Unknown",
duration: 0,
bitrate: null,
year: 0,
trackNo: null,
diskNo: null,
trackTitle: "Unknown",
releaseTitle: "Unknown",
label: "Unknown",
genre: ["Unknown"],
catNo: null,
coverPath: DEFAULT_COVER_URL
```

**NOTE**: making the same `POST` request multiple times or making the `POST` request with updated data, but with the same `catNo` will have no effect. I.e. if the `catNo` of the release already exists in the database, any subsequent `POST` request containing the same `catNo` but updated other properties will have no effect. The reason for such behavior is that _the unique identifier of each release is the `catNo` (category number)_! So, if you will try to create two releases with the same `catNo`, no changes will be applied and no new releases will be created.

```shell
curl --request POST \
     --header "content-type: application/json" \
     --dump-header - \
     --url "musicbox.com:8000/api/releases" \
     --data '{
              "year": 2020,
              "label": "fsol-digital.com",
              "catNo": "NMR-201",
              "releaseArtist": "Aya",
              "releaseTitle": "Strange Flower",
              "tracks": [
                {
                  "trackNo": 1,
                  "trackArtist": ["Aya"],
                  "trackTitle": "Strange Flower",
                  "genre": ["Ambient","Downtempo"],
                  "duration": 161
                }
              ]
            }'
```

#### Success response

- **Code**: 201 Created

  **Content:**

  ```shell
  Location: /releases/56

  {
    id:38
    artist: "Aya"
    catNo: "NMR-201"
    coverPath: "/api/icons/album.svg"
    label: "fsol-digital.com"
    title: "Strange Flower"
    year: 2020
  }
  ```

#### Error response

- **Code**: 400

  **Content**:

  ```shell
  {
    "errorCode":400,
    "message":"BadRequest",
    "more_info":"https://github.com/ponomarevandrey/musicbox"
  }
  ```

### Update a release

```
PUT /releases/:id
```

An attempt to update `catNo` to a `catNo` that already exists in database will result in `409 Conflict` error.

```shell
curl --request PUT \
     --header "content-type: application/json" \
     --dump-header - \
     --url "musicbox.com:8000/api/releases/1" \
     --data '{
              "year": 2023,
              "label": "TEST label",
              "catNo": "CD TOT 55",
              "releaseArtist": "Test Relese Artist",
              "releaseTitle": "Test Release Title",
              "coverPath": "/api/icons/album.svg",
              "tracks": [
                  {
                    "trackId": 1,
                    "trackNo": 2,
                    "diskNo": 1,
                    "trackArtist": [
                        "Test Track Artist"
                    ],
                    "trackTitle": "Test Track Title",
                    "genre": [
                        "Genre1",
                        "Genre2"
                    ],
                    "duration": 1111,
                    "filePath": null,
                    "extension": "flac",
                    "bitrate": 320000
                  },
                  {
                    "trackId": 2,
                    "trackNo": 2,
                    "diskNo": 1,
                    "trackArtist": [
                        "Test Track Artist"
                    ],
                    "trackTitle": "Test Track Title",
                    "genre": [
                        "Genre3",
                        "Genre4"
                    ],
                    "duration": 1111,
                    "filePath": null,
                    "extension": "flac",
                    "bitrate": 320000
                  }
              ]
            }'
```

#### Success response

- **Code**:

  **Content:**

#### Error response

- **Code**: 409

  **Content**:

  ```shell
  {
    "errorCode":409,
    "message":"Conflict",
    "more_info":"https://github.com/ponomarevandrey/musicbox"
  }
  ```

- **Code**: 500

  ```shell
  {
    "errorCode":500,
    "message":"InternalServerError",
    "more_info":"https://github.com/ponomarevandrey/musicbox"
  }
  ```

- **Code**: 422

  ```shell
  {
    "errorCode":422,
    "message":"UnprocessableEntity",
    "more_info":"https://github.com/ponomarevandrey/musicbox"
  }
  ```

### Delete a release

```
DELETE /releases/:id
```

#### Success response

- **Code**: 204

  **Content:** -

#### Error response

- **Code**: 404

  **Content**:

  ```shell
  {
    "errorCode":404,
    "message":"NotFound",
    "more_info":"https://github.com/ponomarevandrey/musicbox"
  }
  ```

- **Code**: 422

  ```shell
  {
    "errorCode":422,
    "message":"UnprocessableEntity",
    "more_info":"https://github.com/ponomarevandrey/musicbox"
  }
  ```

### Get all releases

```
GET /releases
```

#### Success response

- **Code**: 200

  **Content:**

  ```shell
  {
    "page_number":1,
    "total_page":2,
    "total_count":27,
    "previous_page":null,
    "next_page":"/releases?page=2",
    "first_page":"/releases?page=1",
    "last_page":"/releases?page=2",
    "results":[
      {
        "id":6,
        "year":2020,
        "artist":"Disclosure",
        "title":"New Album",
        "coverPath":"/api/images/03_-_Expressing_What_Matters.jpeg"
      },

      {
        "id":4,
        "year":2020,
        "artist":"Various",
        "title":"Innate 003",
        "coverPath":"/api/images/02_-_Sinders.jpeg"
      },

      ...
    ]
  }
  ```

### Get release tracks

```
GET /releases/:id/tracks
```

#### Success response

- **Code**: 200

  **Content:**

```shell
{
  "results": [
    {
      "filePath":"/music/10. Dave Angel - Artech.flac",
      "extension":"flac","trackArtist":["Dave Angel"],
      "releaseArtist":"Various",
      "duration":"206",
      "bitrate":"936890.7961165048",
      "year":1995,
      "trackNo":10,
      "trackTitle":"Artech",
      "releaseTitle":"X-Mix-4 - Beyond The Heavens",
      "diskNo":null,
      "label":"Studio !k7",
      "genre":["DJ Mix"],
      "coverPath":"/api/images/10._Dave_Angel_-_Artech.jpeg",
      "catNo":"BonkEnc v1",
      "trackId":8,
      "releaseId":8
    },

    {
      "filePath":"/music/15. Paul Hazel - Test Pattern.flac",
      "extension":"flac",
      "trackArtist":["Paul Hazel"],
      "releaseArtist":"Various",
      "duration":"214",
      "bitrate":"991080.0747663551",
      "year":1995,
      "trackNo":15,
      "trackTitle":"Test Pattern",
      "releaseTitle":"X-Mix-4 - Beyond The Heavens",
      "diskNo":null,
      "label":"Studio !k7",
      "genre":["DJ Mix"],
      "coverPath":"/api/images/10._Dave_Angel_-_Artech.jpeg",
      "catNo":"BonkEnc v1",
      "trackId":9,
      "releaseId":8
    },

    ...

  ]
}
```

## Years

### Get all years

```
GET /years
```

#### Success response

- **Code**: 200

  **Content:**

  ```shell
  {
    "results": [
      {
        "yearId":4,
        "year":2020
      },

      {
        "yearId":34,
        "year":2014
      },

      ...
    ]
  }
  ```

## Genres

### Get all genres

```
GET /genres
```

#### Success response

- **Code**: 200

  **Content:**

  ```shell
  {
    "results": [
      {
        "genreId":7,
        "name":"Ambient"
      },

      {
        "genreId":53,
        "name":"Ambient [Samples - Pads]"
      },

      ...
    ]
  }
  ```

## Artists

### Get all artists

```
GET /artists
```

#### Success response

- **Code**: 200

  **Content:**

  ```shell
  {
    "results": [
      {
        "artistId":15,
        "name":"Aya"
      },

      {
        "artistId":13,
        "name":"Blue Six"
      },

      ...
    ]
  }
  ```

## Labels

### Get all labels

```
GET /labels
```

#### Success response

- **Code**: 200

  **Content:**

  ```shell
  {
    "results": [
      {
        "labelId":26,
        "name":"Airtight"
      },

      {
        "labelId":24,
        "name":"Aya Napa"
      },

      ...
    ]
  }
  ```

## Stats

### Get short stats

Get music library statistics - total number of releases, tracks, artists, labels, and genres

```
GET /stats
```

#### Success response

- **Code**: 200
  **Content:**

  ```shell
  {
    "results": {
      "releases":27,
      "tracks":37,
      "artists":28,
      "labels":24,
      "genres":15
    }
  }
  ```

### Get genre stats

Get the number of tracks per each genre

```
GET /stats/genres
```

#### Success response

- **Code**: 200

  **Content:**

  ```shell
  {
    "results": [
      {
        "id":7,
        "name":"Ambient",
        "tracks":5
      },

      {
        "id":53,
        "name":"Ambient [Samples - Pads]",
        "tracks":1
      },

      ...
    ]
  }
  ```

### Get artist stats

Get the number of tracks released by each artist

```
GET /stats/artists
```

#### Success response

- **Code**: 200

  **Content:**

  ```shell
  {
    "results": [
      {
        "id":15,
        "name":"Aya",
        "tracks":1
      },

      {
        "id":13,
        "name":"Blue Six",
        "tracks":1
      },

      ...
    ]
  }
  ```

### Get label stats

Get the number of tracks released by each label

```
GET /stats/labels
```

#### Success response

- **Code**: 200

  **Content:**

  ```shell
  {
    "results": [
      {
        "id":26,
        "name":"Airtight",
        "tracks":2
      },

      {
        "id":24,
        "name":"Aya Napa",
        "tracks":1
      },

      ...
    ]
  }
  ```

### Get years stats

Get the number of tracks released in each year

```
GET /stats/years
```

#### Success response

- **Code**: 200

  **Content:**

  ```shell
  {
    "results":[
      {
        "id":4,
        "name":2020,
        "tracks":2
      },

      {
        "id":34,
        "name":2014,
        "tracks":1
      },

      ...
    ]
  }
  ```
