import { useState, useContext } from "react";
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

  const [GeneratingPlaylist, setGeneratingPlaylist] = useState<boolean>();

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

  const callCreatePlaylist = (e:any) => {
    e.preventDefault();
    setTimeout(() => {
      context.globalGoogleToken && context.PlaylistName && videoIds.length > 0
        ? createPlaylist()
        : "";
    }, 2000);
  };

  async function createPlaylist() {
    setGeneratingPlaylist(true);
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
        setGeneratingPlaylist(false);
        context.setPlaylistGenerated(true);
        setTimeout(() => {
          context.setPlaylistGenerated(false);
        }, 3000);
      })
      .catch(() => {
        context.setPlaylistGenerated(false);
      });
  }

  return (
    <div className="flex">
      <button
        className={`rounded py-2 px-4 bg-[#fd0000] text-white font-['Ubuntu'] font-medium ${
          videoIds.length === 0 ||
          GeneratingPlaylist ||
          context.PlaylistGenerated
            ? "opacity-50"
            : "opacity-100"
        }`}
        onClick={callCreatePlaylist}
        disabled={
          videoIds.length === 0 ||
          GeneratingPlaylist ||
          context.PlaylistGenerated
            ? true
            : false
        }
      >
        {context.PlaylistGenerated
          ? "Playlist Created"
          : GeneratingPlaylist
          ? "Creating..."
          : "Create Playlist"}
      </button>
    </div>
  );
}
