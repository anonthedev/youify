import axios from "axios";
import { FormEvent } from "react";

function addTracksToSpotifyPlaylist(
  tracks: any,
  playlistId: number,
  spotifyToken: string
) {
  fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + spotifyToken,
    },
    body: JSON.stringify({
      uris: tracks,
      position: 0,
    }),
  });
}

export async function createSpotifyPlaylist(
  spotifyToken: string,
  tooManyTracks: string[],
  trackURIs: string[],
  userId: string,
  setPlaylistCompletion: Function
) {
  setPlaylistCompletion("Creating...");
  var createPlaylistParams = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + spotifyToken,
    },
    body: JSON.stringify({
      name: "Playlist generated by Youify",
      description: "By Youify",
      public: true,
    }),
  };

  const URL = `https://api.spotify.com/v1/users/${userId}/playlists`;

  fetch(URL, createPlaylistParams)
    .then((data) => {
      return data.json();
    })
    .then((resp) => {
      return resp.id;
    })
    .then((id) => {
      if (tooManyTracks.length != 0) {
        tooManyTracks.map((chunksOfTrackURIs, index) => {
          setTimeout(() => {
            addTracksToSpotifyPlaylist(chunksOfTrackURIs, id, spotifyToken);
          }, index * 700);
        });
      } else {
        addTracksToSpotifyPlaylist(trackURIs, id, spotifyToken);
      }
    })
    .then(() => {
      setPlaylistCompletion("Playlist Created");
    })
    .catch((err) => {
      console.log(err);
    });
}

export async function fetchYTPlaylist(
  YT_URL: string,
  playListURL: string | undefined,
  apiKey: string,
  setAllItemsRecieved: Function,
  setData: Function,
) {
  // setData([]);
  // e.preventDefault();
  axios.get(YT_URL).then((resp) => {
    setData((prev: any) => [...prev, ...resp.data.items]);
    if (resp.data.nextPageToken) {
      YT_URL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&pageToken=${
        resp.data.nextPageToken
      }&playlistId=${
        playListURL
          ? playListURL.slice(playListURL.indexOf("list")).slice(10)
          : ""
      }&key=${apiKey}`;

      fetchYTPlaylist(YT_URL, playListURL, apiKey, setAllItemsRecieved, setData);
    } else if (!resp.data.nextPageToken) {
      setAllItemsRecieved(true);
    }
  });
}

export async function fetchSpotifyPlaylist(e: FormEvent, spotifyToken: string, SPOTIFY_URL: string, setData: Function) {
    e.preventDefault();
    var getPlaylist = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + spotifyToken,
      },
    };
    fetch(SPOTIFY_URL, getPlaylist)
      .then((data) => data.json())
      .then((resp) => {
        // console.log(resp);
        setData(resp);
      });
  };
