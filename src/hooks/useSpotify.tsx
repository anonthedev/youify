"use client";

import { useEffect, useContext } from "react";
import { GlobalContext } from "@/app/contextProvider";
import { signIn, useSession } from "next-auth/react";
// import spotifyApi from "../lib/spotify";
import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET,
  // redirectUri: "http://localhost:3000/api/auth/callback/spotify"
});

export default function useSpotify() {
  const context = useContext(GlobalContext)
  const { data: session, status } = useSession();
  useEffect(() => {
    if (session) {
      if (session.accProvider === "spotify") {
        if (session.error === "RefreshAccessTokenError") {
          signIn();
        }
        context.setSpotifyGlobalToken(session.user.spotifyAccessToken)
        localStorage.setItem("spotifyAccessToken", session.user.spotifyAccessToken)
        spotifyApi.setAccessToken(session.user.spotifyAccessToken);
      }

    }
  });
  // localStorage.getItem("spotifyAccessToken")
  return spotifyApi;
}
