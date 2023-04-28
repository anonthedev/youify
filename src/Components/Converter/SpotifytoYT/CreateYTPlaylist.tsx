import { useState, useContext, useEffect } from "react";
import { GlobalContext } from "@/app/contextProvider";

export default function CreateYTPlaylist() {
  const context = useContext(GlobalContext);
  const videoIds: string[] = [];
  context.playlistTracks
    ? context.playlistTracks.map((track: any) => {
        // console.log(track.items[0].id.videoId);
        videoIds.push(track.items[0].id.videoId);
      })
    : "";

  const wait = "Wait...";
  const creating = "Creating...";
  const created = "Playlist Created";
  const wrong = "Try again";

  const [playlistCompletion, setPlaylistCompletion] = useState("");

  useEffect(() => {
    if (playlistCompletion === created) {
      setTimeout(() => {
        setPlaylistCompletion("Create Playlist");
      }, 3000);
    } else if (playlistCompletion === wrong) {
      setTimeout(() => {
        setPlaylistCompletion("Create Playlist");
      }, 3000);
    }
  }, [playlistCompletion]);

  function addTracksToPlaylist(videoId: string, playlistId: string) {
    fetch(
      ` https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails,id,snippet,status`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + context.globalGoogleToken,
        },
        body: JSON.stringify({
          snippet: {
            playlistId: playlistId,
            resourceId: {
              kind: "youtube#video",
              videoId: videoId,
            },
          },
        }),
      }
    );
    // console.log(videoId, playlistId)
  }

  const callCreatePlaylist = (e: any) => {
    e.preventDefault();
    setPlaylistCompletion(wait);
    setTimeout(() => {
      if (
        context.globalGoogleToken &&
        context.PlaylistName &&
        videoIds.length > 0
      ) {
        createPlaylist();
      } else {
        setPlaylistCompletion(wrong);
      }
    }, 2000);
  };

  async function createPlaylist() {
    setPlaylistCompletion(creating);
    var createPlaylistParams = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + context.globalGoogleToken,
      },
      body: JSON.stringify({
        snippet: {
          title: context.PlaylistName,
          description: context.PlaylistDesc,
        },
        status: {
          privacyStatus: "public",
        },
      }),
    };

    const URL = `https://www.googleapis.com/youtube/v3/playlists?part=id,snippet,status`;

    fetch(URL, createPlaylistParams)
      .then((data) => {
        return data.json();
      })
      .then((resp) => {
        // console.log(resp);
        return resp.id;
      })
      .then((id) => {
        videoIds.map((singleVideoId, index) => {
          setTimeout(() => {
            addTracksToPlaylist(singleVideoId, id);
          }, 1200 * index);
        });
      })
      .then(() => {
        setPlaylistCompletion(created);
      })
      .catch(() => {
        setPlaylistCompletion("Try again");
      });
  }

  return (
    <div className="flex">
      <button
        className={`rounded py-2 px-4 bg-[#fd0000] text-white font-raleway font-medium ${
          videoIds.length === 0 ||
          playlistCompletion === wait ||
          playlistCompletion === creating ||
          playlistCompletion === created ||
          playlistCompletion === wrong
            ? "opacity-50"
            : "opacity-100"
        }`}
        onClick={callCreatePlaylist}
        disabled={
          videoIds.length === 0 ||
          playlistCompletion === wait ||
          playlistCompletion === creating ||
          playlistCompletion === created ||
          playlistCompletion === wrong
            ? true
            : false
        }
      >
        {playlistCompletion ? playlistCompletion : "Create Playlist"}
      </button>
    </div>
  );
}
