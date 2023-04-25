"use client";

import { useState, useContext, useEffect } from "react";
import { GlobalContext } from "@/app/contextProvider";
import YTtoSpotify from "./YTtoSpotify/YTtoSpotify";
import SpotifytoYT from "./SpotifytoYT/SpotifytoYT";
import axios from "axios";
import useRefreshSpotifyToken from "@/hooks/useRefreshSpotifyToken";

export default function Converter() {
  const currentDate = Date.now();
  const refreshSpotifyToken = useRefreshSpotifyToken();
  const [WhatToWhat, setWhatToWhat] = useState(["YouTube", "Spotify"]);
  const [From, setFrom] = useState("YouTube");
  const [To, setTo] = useState("Spotify");
  const context = useContext(GlobalContext);

  const LSAvailable = typeof window !== "undefined";
  const spotifyToken = LSAvailable
    ? localStorage.getItem("spotifyAccessToken")
    : {};
  context.setSpotifyGlobalToken(spotifyToken);

  useEffect(() => {
    function getUserIdSpotify() {
      var userParams = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("spotifyAccessToken"),
        },
      };

      axios
        .get("https://api.spotify.com/v1/me", userParams)
        .then((resp) => {
          // console.log(resp.data.id);
          context.setUserId(resp.data.id);
          // console.log("X");
          // navigate("/googleLogin");
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (LSAvailable) {
      const spotifyTokenExpireDate = new Date(
        localStorage.getItem("spotifyTokenExpire")!
      );
      if (currentDate >= spotifyTokenExpireDate) {
        refreshSpotifyToken;
      } else if (currentDate < spotifyTokenExpireDate) {
        getUserIdSpotify();
      } else {
        getUserIdSpotify();
      }
    }
  });

  // console.log(WhatToWhat);
  return (
    <main className="w-screen flex flex-col">
      <div className="self-end px-10 py-4">{/* <SignOut /> */}</div>
      <section className="h-screen flex flex-col items-center justify-center gap-20">
        <div className="flex flex-row w-screen items-center justify-center gap-4">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="bg-[#2d2d2d] px-8 py-2 rounded-md text-center">
              {From}
            </div>
            <span>TO</span>
            <div className="bg-[#2d2d2d] px-8 py-2 rounded-md text-center">
              {To}
            </div>
          </div>
          <div
            onClick={() => {
              setWhatToWhat(WhatToWhat.reverse());
              setFrom(WhatToWhat[0]);
              setTo(WhatToWhat[1]);
              context.setPlaylistTracks([]);
            }}
            className="text-3xl cursor-pointer"
          >
            {String.fromCodePoint(parseInt("21C5", 16))}
          </div>
        </div>
        {WhatToWhat[0] === "Spotify" ? <SpotifytoYT /> : <YTtoSpotify />}
      </section>
      <footer>
        {/* <div className="max-w-prose text-center text-white text-xs absolute bottom-0 right-0 ">
          <img src={ytLogo} alt="" width={150} />
        </div> */}
      </footer>
    </main>
  );
}
