"use client";

import { createContext, useState } from "react";

export const GlobalContext = createContext<any>(null);

export default function ContextProvider({ children }: { children: any }) {
  const [userId, setUserId] = useState();
  const [globalSpotifyToken, setSpotifyGlobalToken] = useState();
  const [playlistTracks, setPlaylistTracks] = useState();
  const [convertFromTo, setConvertFromTo] = useState();
  const [globalGoogleToken, setGlobalGoogleToken] = useState()
  const [PlaylistName, setPlaylistName] = useState()
  const [PlaylistDesc, setPlaylistDesc] = useState()


  return (
    <GlobalContext.Provider value={{
        userId,
        setUserId,
        playlistTracks,
        setPlaylistTracks,
        globalSpotifyToken,
        setSpotifyGlobalToken,
        convertFromTo,
        setConvertFromTo,
        globalGoogleToken,
        setGlobalGoogleToken,
        PlaylistName,
        setPlaylistName,
        PlaylistDesc,
        setPlaylistDesc,
      }}>
      {children}
    </GlobalContext.Provider>
  );
}