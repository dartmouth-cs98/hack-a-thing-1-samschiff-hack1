const baseUrl = "https://morning-plains-92296.herokuapp.com";
//bpm, marginOfError, maxTracks, playlistName,
export const createPlaylist = (
  useSavedSongs,
  usePlaylists,
  bpm,
  playlistName
) => {
  return fetch(`${baseUrl}/api/playlist`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      useSavedSongs,
      usePlaylists,
      bpm,
      playlistName,
      marginOfError: 5,
      maxTracks: 20
    })
  })
    .then(res => {
      return res;
    })
    .catch(err => {
      return err;
    });
};
