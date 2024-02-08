import { useState, useContext, FormEvent } from "react";
import { GlobalContext } from "@/app/contextProvider";
import SearchSongsOnYT from "./SearchSongsOnYT";
import CreateYTPlaylist from "./CreateYTPlaylist";
import Link from "next/link";
import { useSession } from "next-auth/react";
import ytLogo from "../../resources/images/yt-logo.png"
import Image from "next/image";
import { fetchSpotifyPlaylist } from "@/Components/utils/utilsFunctions";

export default function SpotifytoYT() {
  const [Data, setData] = useState<any>();
  const [playListURL, setPlayListURL] = useState<string>();
  const context = useContext(GlobalContext);
  const { data: session } = useSession();

  context.setGlobalGoogleToken(session && session.user.googleAccessToken);
  const [playistURLVaild, setPlayistURLValid] = useState<boolean>();

  const SPOTIFY_URL = `	https://api.spotify.com/v1/playlists/${
    playListURL
      ? playListURL.substring(
          playListURL.indexOf("playlist") + 9,
          playListURL.indexOf("playlist") + 31
        )
      : ""
  }/tracks`;

  if (context.globalGoogleToken) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center">
        {/* <div>
          Verification in process you can&apos;t convert Spotify to YouTube yet
        </div> */}
        <form
          action=""
          onSubmit={(e:FormEvent)=>{
            fetchSpotifyPlaylist(e, context.globalSpotifyToken, SPOTIFY_URL, setData)
          }}
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
        <div className="fixed bottom-0 left-0">
          <Image src={ytLogo} width={120} height={10} className={`mt-2`} alt="YouTube logo"></Image>
        </div>
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
