# Data structures / table relationships
![](./musicbox-db-design.svg)



# Business rules

Application supports only `mp3` and `flac` files.

If id3v2 tag is empty, just insert `NULL`.

Where not mentioned, `NULL` value is allowed.

* Tables

  * Validation Table `extension`
    ```
    name     varchar(100)       NOT NULL, UNIQUE, not empty string
    ```
    This table contains the following values: `.mp3`, `.flac`

  * Data Table `tyear`
    ```
    tear     smallint           UNIQUE
    ``` 

  * Data Table `album`
    ```
    title    varchar(100)     
    ```

  * Data Table `track`
    ```
    disk_no      smallint
    track_no     smallint
    
    title        varchar(100)
    comment      text
    bitrate      numeric
    duration     numeric
    bpm          integer
    sample_rate  integer 
    file_path    varchar(255)   NOT NULL, UNIQUE, not empty string
    ```

  * Data Table `genre`
    ```
    name         varchar(100)   UNIQUE 
    ```


  * Data Table `artist`
    ```
    name         varchar(100)   NOT NULL, UNIQUE
    ```


  * Data Table `label`
    ```
    name      varchar(100)      NOT NULL, UNIQUE
    ```




# Views

* `track` view should constist of: `year`, `title`, `artist`, `album`, `label`, `genre`, `bpm` 
