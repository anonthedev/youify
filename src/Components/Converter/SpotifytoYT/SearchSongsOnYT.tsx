/* eslint-disable @next/next/no-img-element */
import { useState, useContext, useEffect, useRef } from "react";
import { GlobalContext } from "@/app/contextProvider";

export default function SearchSongsOnYT({ title }: { title: any }) {
  const [Alltracks, setTracks] = useState<any[]>([]);
  const context = useContext(GlobalContext);

  const playlistNameRef = useRef(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    const arr: any[] = [];
    // console.log(localStorage.getItem("spotifyAccessToken"))
    setTracks([]);
    title
      ? title.map(async (singleTitle: any) => {
          const URL = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${
            singleTitle.track.name.replace(" ", "%20") +
            "%20" +
            singleTitle.track.artists[0].name.replace(" ", "%20") +
            "%20" +
            "song topic"
          }&type=video&part=snippet&maxResults=1`;
          // console.log(URL);
          await fetch(URL)
            .then((data) => data.json())
            .then((resp) => {
              // console.log(resp);
              arr.push(resp);
              setTracks((Alltracks) => [...Alltracks, resp]);
            });
          setTimeout(() => {
            context.setPlaylistTracks(arr);
          }, 1500);
        })
      : "";
  }, [title]);

  // console.log(Alltracks.length != 0 ? Alltracks : "");
  // console.log(context.playlistTracks.length != 0 ? context.playlistTracks : "");

  return (
    <div className="max-h-48 overflow-y-visible">
      <div className="flex flex-row gap-4 items-center md:flex-col">
        <input
          ref={playlistNameRef}
          className="p-4 rounded text-black"
          type="text"
          name=""
          id=""
          value={context.PlaylistName}
          placeholder="Playlist Name"
          disabled={Alltracks.length === 0 ? true : false}
          onChange={(e) => {
            context.setPlaylistName(e.target.value);
          }}
        />
        <textarea
          className="p-4 rounded h-auto text-black"
          //   type="text"
          name=""
          id=""
          cols={30}
          placeholder="Playlist Desc (optional)"
          value={context.PlaylistDesc}
          disabled={Alltracks.length === 0 ? true : false}
          onChange={(e) => {
            context.setPlaylistDesc(e.target.value);
          }}
        />
      </div>

      {!context.PlaylistName && context.playlistTracks.length !== 0 ? (
        <div>
          <p className="text-[#b73030]  md:text-center font-semibold">
            Please set Playlist name
          </p>
        </div>
      ) : (
        ""
      )}

      <div className="w-96">
        {Alltracks.length != 0
          ? Alltracks.map((track, index) => {
              const actualTrack = track.items[0];
              // console.log(actualTrack)
              return (
                <div key={index}>
                  <div className="flex flex-row items-center my-2 gap-2 sm:px-8">
                    <img
                      className="rounded"
                      src={actualTrack.snippet.thumbnails.default.url}
                      alt=""
                    />
                    <div className="flex gap-2 flex-col">
                      <h3 className="">{actualTrack.snippet.title}</h3>
                    </div>
                  </div>
                </div>
              );
            })
          : ""}
      </div>
    </div>
  );
}
