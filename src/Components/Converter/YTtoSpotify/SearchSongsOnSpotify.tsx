/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useContext, useEffect } from "react";
import { GlobalContext } from "@/app/contextProvider";
import axios from "axios";

export default function SearchSongsOnSpotify({ title }: { title: any }) {
  const [Alltracks, setTracks] = useState<any>([]);
  const arr: string[] = [];
  const context = useContext(GlobalContext);

  useEffect(() => {
    setTracks([]);
    var trackParams = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + context.globalSpotifyToken,
      },
    };
    // console.log(context.globalSpotifyToken)
    title
      ? title.map(async (singleTitle: any) => {
          // console.log(singleTitle.snippet.title);
          // const URL = `https://api.spotify.com/v1/search?q=${singleTitle.snippet.title}&type=track`;
          const URL = `/api/spotify/getSpotifySongs?q=${singleTitle.snippet.title.slice(0, 45)}&type=track`;
          await axios
            .get(URL, trackParams)
            .then((resp) => {
              if (resp.status === 200 && resp.data) {
                  arr.push(resp.data);
                  setTracks((Alltracks: any) => [...Alltracks, resp.data]);
              }
            })
            .catch((err) => {
              console.log(err);
            });
          setTimeout(() => {
            context.setPlaylistTracks(arr);
          }, 1500);
        })
      : "";
  }, [title]);

  return (
    <div className="max-h-48 w-96 overflow-y-visible">
      {Alltracks.length != 0
        ? Alltracks.map((track: any, index: number) => {
            const actualTrack = track.tracks.items[0];
            if (actualTrack) {
              return (
                <div key={index}>
                  <a href={actualTrack.external_urls.spotify} target="_blank">
                    <div className="flex flex-row items-center my-2 gap-2 sm:px-8">
                      <img
                        className="rounded"
                        src={actualTrack.album.images[2].url}
                        alt=""
                      />
                      <div className="flex gap-2 flex-col">
                        <h3 className="">{actualTrack.name}</h3>
                        <div className="flex flex-row">
                          {actualTrack.artists.map(
                            (artist: any, index: number) => (
                              <p key={index} className="text-sm text-[#868484]">
                                {(index ? ", " : "") + artist.name}
                              </p>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              );
            }
          })
        : ""}
    </div>
  );
}
