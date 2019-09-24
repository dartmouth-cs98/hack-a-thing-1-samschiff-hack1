import { NO_AUTH_TOKEN, ACCESS_TOKEN_EXPIRED, SERVER_ERROR } from './constants';
/* eslint-disable no-await-in-loop */
require('@babel/polyfill');

// TODO
// use saved albums too
// Styling!
// Figure out which spotify permissions you need

// Fisher-Yates O(n) shuffle
const shuffle = array => {
  let m = array.length;
  const result = array;
  let t;
  let i;
  while (m) {
    i = Math.floor(Math.random() * m);
    m -= 1;
    t = result[m];
    result[m] = result[i];
    result[i] = t;
  }
  return result;
};

const filterTracksByBpm = (trackData, targetBpm, marginOfError, maxNumberOfTracks) => {
  const moe = parseFloat(marginOfError);
  const bpm = parseFloat(targetBpm);
  const filteredTracks = trackData
    .filter(track => {
      return track && (parseFloat(track.tempo) < bpm + moe && parseFloat(track.tempo) > bpm - moe);
    })
    .map(track => {
      return track.uri;
    });
  let shuffledTracks = shuffle(filteredTracks);
  if (shuffledTracks.length > maxNumberOfTracks) {
    shuffledTracks = shuffledTracks.slice(0, maxNumberOfTracks);
  }
  return shuffledTracks;
};

const parseTracksToIds = tracks => {
  return tracks.map(item => item.track.id);
};

const createUniqueArray = trackIds => {
  console.log(trackIds.length);
  return Array.from(new Set(trackIds));
};

const getTrackDataFromIds = async (spotifyApi, trackIds) => {
  try {
    let features = [];
    let index = 0;
    while (index < trackIds.length) {
      const data = await spotifyApi.getAudioFeaturesForTracks(
        trackIds.slice(index, index + 100 < trackIds.length ? index + 100 : trackIds.length)
      );
      features = features.concat(data.body.audio_features);
      index += 100;
    }
    return features;
  } catch (err) {
    throw err;
  }
};

const getSavedTrackIds = async (spotifyApi, useSavedSongs) => {
  if (useSavedSongs) {
    try {
      const data = await spotifyApi.getMySavedTracks({ limit: 50, offset: 0 });
      const trackIds = parseTracksToIds(data.body.items);
      return trackIds;
    } catch (err) {
      throw err;
    }
  } else {
    return [];
  }
};

const getPlaylistTrackIds = async (spotifyApi, usePlaylists) => {
  if (usePlaylists) {
    try {
      const user = await spotifyApi.getMe();
      const playlists = await spotifyApi.getUserPlaylists(user.body.id, { limit: 50, offset: 0 });
      let tracks = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const playlist of playlists.body.items) {
        try {
          const playlistTracks = await spotifyApi.getPlaylistTracks(playlist.id);
          tracks = tracks.concat(playlistTracks.body.items);
        } catch (err) {
          throw err;
        }
      }
      const trackIds = parseTracksToIds(tracks);
      return trackIds;
    } catch (err) {
      throw err;
    }
  } else {
    return [];
  }
};

export const getSongs = async (
  spotifyApi,
  bpm,
  marginOfError,
  maxTracks,
  useSavedSongs,
  usePlaylists
) => {
  try {
    console.log(1);
    const savedTrackIds = await getSavedTrackIds(spotifyApi, useSavedSongs);
    console.log(2);
    const playlistTrackIds = await getPlaylistTrackIds(spotifyApi, usePlaylists);
    console.log(3);
    const trackIds = savedTrackIds.concat(playlistTrackIds);
    console.log(3.5);
    const uniqueTrackIds = createUniqueArray(trackIds);
    console.log(uniqueTrackIds.length);
    console.log(4);
    const trackData = await getTrackDataFromIds(spotifyApi, uniqueTrackIds);
    console.log(5);
    const filteredTrackUris = await filterTracksByBpm(trackData, bpm, marginOfError, maxTracks);
    console.log(6);
    return filteredTrackUris;
  } catch (err) {
    throw err;
  }
};

export const createPlaylist = async (spotifyApi, uris, name) => {
  try {
    console.log(7);
    const user = await spotifyApi.getMe();
    console.log(8);
    const data = await spotifyApi.createPlaylist(user.body.id, name);
    console.log(9);
    const externalUrl = data.body.external_urls.spotify;
    await spotifyApi.addTracksToPlaylist(data.body.id, uris);
    console.log(10);
    return externalUrl;
  } catch (err) {
    throw err;
  }
};

const refreshToken = async spotifyApi => {
  try {
    const data = await spotifyApi.refreshAccessToken();
    await spotifyApi.setAccessToken(data.body.accessToken);
    return 'Successfully Updated Token';
  } catch (err) {
    throw err;
  }
};

export const handle = async (req, res, err, func, spotifyApi) => {
  const { statusCode, message } = err;
  if (statusCode && statusCode === '401' && message && message === ACCESS_TOKEN_EXPIRED) {
    try {
      await refreshToken(spotifyApi);
      func(req, res);
    } catch (err2) {
      res.status(401).json({ message: NO_AUTH_TOKEN, err: err2 });
      throw err2;
    }
  } else {
    res
      .status((statusCode && parseInt(statusCode, 10)) || 500)
      .json({ message: message || SERVER_ERROR });
    throw err;
  }
};
