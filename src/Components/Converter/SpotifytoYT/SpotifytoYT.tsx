import { useState, useContext } from "react";
import { GlobalContext } from "@/app/contextProvider";
import SearchSongsOnYT from "./SearchSongsOnYT";
import CreateYTPlaylist from "./CreateYTPlaylist";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function SpotifytoYT() {
  const [Data, setData] = useState<any>();
  const [playListURL, setPlayListURL] = useState<string>();
  const context = useContext(GlobalContext);
  const { data: session } = useSession();

  context.setGlobalGoogleToken(session.user.googleAccessToken);
  const [playistURLVaild, setPlayistURLValid] = useState<boolean>();
  // const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

  // console.log(context.globalSpotifyToken);

  const spotify_URL = `	https://api.spotify.com/v1/playlists/${
    playListURL
      ? playListURL.substring(
          playListURL.indexOf("playlist") + 9,
          playListURL.indexOf("playlist") + 31
        )
      : ""
  }/tracks`;

  const fetchData = async (e: any) => {
    e.preventDefault();
    var getPlaylist = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + context.globalSpotifyToken,
      },
    };
    fetch(spotify_URL, getPlaylist)
      .then((data) => data.json())
      .then((resp) => {
        // console.log(resp);
        setData(resp);
      });
  };

  if (context.globalGoogleToken) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center">
        {/* <div>
          Verification in process you can&apos;t convert Spotify to YouTube yet
        </div> */}
        <form
          action=""
          onSubmit={fetchData}
          className="flex gap-2 flex-row md:flex-col md:justify-center md:items-center"
        >
          <input
            className={`p-4 w-96 md:w-80 rounded bg-white ${
              !playistURLVaild && playListURL
                ? "border-4 outline-0 border-red-600"
                : "border-0"
            } text-black`}
            type="url"
            name=""
            id=""
            placeholder="Paste the spotify playlist link"
            onChange={(e) => {
              setPlayListURL(e.target.value);
              if (e.target.value?.includes("spotify")) {
                setPlayistURLValid(true);
              } else {
                setPlayistURLValid(false);
              }
              setData([]);
            }}
          />
          <button
            className="rounded py-2 px-4 bg-[#FFC42C] text-black font-raleway font-medium"
            type="submit"
          >
            Get Tracks
          </button>
          <CreateYTPlaylist />
        </form>
        {!playistURLVaild && playListURL ? (
          <div className="text-red-500 justify-start">
            Please put in a valid link
          </div>
        ) : null}
        <SearchSongsOnYT title={Data ? Data.items : []} />
      </div>
    );
  } else if (!context.globalSpotifyToken) {
    return (
      <div className="">
        <Link href={"/spotifyLogin"}>
          <button className="px-8 py-4 rounded text-black font-bold font-raleway bg-[#FFC42C] mr-8">
            Login First
          </button>
        </Link>
      </div>
    );
  } else {
    return (
      <div className="">
        <Link href={"/googleLogin"}>
          <button className="py-2 px-4 bg-[#581111] text-white rounded-lg mr-8">
            Login through google
          </button>
        </Link>
      </div>
    );
  }
}
