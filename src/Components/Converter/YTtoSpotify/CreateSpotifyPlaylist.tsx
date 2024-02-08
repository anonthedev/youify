import { useContext, useState, useEffect } from "react";
import { GlobalContext } from "@/app/contextProvider";
import { createSpotifyPlaylist } from "@/Components/utils/utilsFunctions";

export default function CreateSpotifyPlaylist() {
  const context = useContext(GlobalContext);
  const trackURIs: string[] = [];
  const tooManyTracks: Array<any> = [];
  context.playlistTracks
    ? context.playlistTracks.map((track: any) => {
        if (track.tracks.items[0]) {
          trackURIs.push(track.tracks.items[0].uri);
        }
      })
    : "";

  const wait = "Wait...";
  const creating = "Creating...";
  const created = "Playlist Created";

  const [playlistCompletion, setPlaylistCompletion] = useState("");

  console.log(trackURIs.length != 0 ? trackURIs : "");

  useEffect(() => {
    if (playlistCompletion === created) {
      setTimeout(() => {
        setPlaylistCompletion("Create Playlist");
      }, 3000);
    }
  }, [playlistCompletion]);

  if (trackURIs.length > 99) {
    while (trackURIs.length > 0) {
      const x = trackURIs.splice(0, 98);
      tooManyTracks.push(x);
      // console.log(tooManyTracks);
    }
  }

  const callCreatePlaylist = (e: any) => {
    e.preventDefault();
    setPlaylistCompletion(wait);
    setTimeout(() => {
      context.globalSpotifyToken && trackURIs.length > 0
        ? createSpotifyPlaylist(context.globalSpotifyToken, tooManyTracks, trackURIs, context.userId, setPlaylistCompletion)
        : "";
    }, 1500);
  };

  return (
    <div className="flex">
      <button
        className={`rounded py-2 px-4 bg-[#1bc257] text-black font-raleway font-medium ${
          trackURIs.length === 0 ||
          playlistCompletion === wait ||
          playlistCompletion === creating ||
          playlistCompletion === created
            ? "opacity-50"
            : "opacity-100"
        }`}
        onClick={callCreatePlaylist}
        disabled={
          trackURIs.length === 0 ||
          playlistCompletion === wait ||
          playlistCompletion === creating ||
          playlistCompletion === created
            ? true
            : false
        }
      >
        {playlistCompletion ? playlistCompletion : "Create Playlist"}
      </button>
    </div>
  );
}
