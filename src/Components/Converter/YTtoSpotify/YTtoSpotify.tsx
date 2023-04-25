"use client"

import { useState, useContext } from "react";
import axios from "axios";
import Link from "next/link";
import { GlobalContext } from "@/app/contextProvider";
import SearchSongsOnSpotify from "./SearchSongsOnSpotify";
import CreateSpotifyPlaylist from "./CreateSpotifyPlaylist";

export default function YTtoSpotify() {
    const LSAvailable = typeof window !== "undefined"
    const spotifyToken = LSAvailable ? localStorage.getItem("spotifyAccessToken") : {}
    const [Data, setData] = useState<any>([]);
    const [playListURL, setPlayListURL] = useState<string>();
    // const context = useContext(GlobalContext);
    //   console.log(context.globalSpotifyToken)
    
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  
    let YT_URL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=5&playlistId=${
      playListURL ? playListURL.slice(playListURL.indexOf("list")).slice(10) : ""
    }&key=${apiKey}`;
  
    // console.log(YT_URL);
  
    // console.log(context.userId);
    // console.log(
    //   context.playlistTracks ? context.playlistTracks.tracks.items[0].uri : "no"
    // );
  
    const fetchData = async (e:any) => {
      setData([])
      e.preventDefault();
      axios
        .get(YT_URL)
        // .then((data)=> (data.json()))
        .then((resp) => {
          // console.log(resp);
          setData((prev: any) => [...prev, ...resp.data.items]);
          if (resp.data.nextPageToken) {
            YT_URL = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=5&pageToken=${
              resp.data.nextPageToken
            }&playlistId=${
              playListURL
                ? playListURL.slice(playListURL.indexOf("list")).slice(10)
                : ""
            }&key=${apiKey}`;
  
            fetchData(e);
          }
        });
    };
  
    if (spotifyToken) {
      return (
        <div className="flex flex-col gap-4 justify-center items-center">
          <form
            action=""
            onSubmit={fetchData}
            className="flex gap-2 flex-row md:flex-col md:justify-center md:items-center"
          >
            <input
              className="p-4 w-96 md:w-80 rounded text-black"
              type="url"
              name=""
              id=""
              placeholder="Paste the youtube playlist link"
              onChange={(e) => {
                setPlayListURL(e.target.value);
              }}
            />
            <button
              className="rounded py-2 px-4 bg-[#FFC42C] text-black font-raleway font-medium"
              type="submit"
            >
              Get Tracks
            </button>
            <CreateSpotifyPlaylist />
          </form>
          <SearchSongsOnSpotify title={Data ? Data : []} />
        </div>
      );
    } else {
      return (
        <div className="">
          <Link href={"/spotifyLogin"}>
            <button className="px-8 py-4 rounded text-black font-bold font-['Raleway'] bg-[#FFC42C] mr-8">
              Login First
            </button>
          </Link>
        </div>
      );
    }
  }