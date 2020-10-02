// Loop through all tracks (objects) in the database and find ones that
// simultaneously match all selected options in ALL select boxes
function findMatchingTracks(tracks, selectedOptions) {
  const filteredTracks = tracks.filter(track => {
    const isYearMatch = (() => {
      return (
        selectedOptions.year.includes(track.year) ||
        selectedOptions.year.includes("All")
      );
    })();

    const isGenreMatch = (() => {
      return (
        track.genre.some(genre => {
          return selectedOptions.genre.includes(genre);
        }) || selectedOptions.genre.includes("All")
      );
    })();

    const isAlbumMatch = (() => {
      return (
        selectedOptions.album.includes(track.album) ||
        selectedOptions.album.includes("All")
      );
    })();

    const isLabelMatch = (() => {
      return (
        selectedOptions.label.includes(track.label) ||
        selectedOptions.label.includes("All")
      );
    })();

    const isArtistMatch = (() => {
      return (
        track.artist.some(artist => {
          return selectedOptions.artist.includes(artist);
        }) || selectedOptions.artist.includes("All")
      );
    })();

    const isMatched =
      isYearMatch &&
      isGenreMatch &&
      isAlbumMatch &&
      isLabelMatch &&
      isArtistMatch;

    if (isMatched) return true;
  });

  return filteredTracks;
}

export default findMatchingTracks;
