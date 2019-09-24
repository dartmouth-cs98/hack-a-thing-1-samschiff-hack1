import SpotifyWebApi from 'spotify-web-api-node';
import { getSongs, createPlaylist, handle } from './helper';
import { NO_SONGS_FOUND, SERVER_ERROR, INVALID_INPUT } from './constants';

require('@babel/polyfill');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  redirectUri: process.env.redirectUri
});

export const playlist = async (req, res) => {
  const { bpm, marginOfError, maxTracks, playlistName, useSavedSongs, usePlaylists } = req.body;
  if (playlistName && bpm && (usePlaylists || useSavedSongs)) {
    try {
      const uris = await getSongs(
        spotifyApi,
        bpm,
        marginOfError,
        maxTracks,
        useSavedSongs,
        usePlaylists
      );
      if (uris.length === 0) {
        res.status(404).json({ message: NO_SONGS_FOUND });
        console.error('no songs found');
      } else {
        const url = await createPlaylist(spotifyApi, uris, playlistName);
        res.status(200).json({ url });
      }
    } catch (err) {
      try {
        await handle(req, res, err, playlist, spotifyApi);
      } catch (err2) {
        console.error(err2);
      }
    }
  } else {
    res.status(400).json({ message: INVALID_INPUT });
  }
};

export const credentials = (req, res) => {
  res.status(200).json({
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret
  });
};

export const code = async (req, res) => {
  try {
    const data = await spotifyApi.authorizationCodeGrant(req.body.code);
    spotifyApi.setAccessToken(data.body.access_token);
    spotifyApi.setRefreshToken(data.body.refresh_token);
    res.status(200).json({ message: 'successfully used code to get tokens' });
  } catch (err) {
    res.status(500).json({ message: SERVER_ERROR });
    console.error(err);
  }
};

export const profile = async (req, res) => {
  try {
    const data = await spotifyApi.getMe();
    res.status(200).json(data.body);
  } catch (err) {
    try {
      await handle(req, res, err, profile, spotifyApi);
    } catch (err2) {
      console.error(err2);
    }
  }
};
