/* eslint-disable @next/next/no-img-element */
import { useState, useContext, useEffect } from "react";
import { GlobalContext } from "@/app/contextProvider";

export default function SearchSongsOnYT({ title }: { title: any }) {
  const [Alltracks, setTracks] = useState<any[]>([]);
  const context = useContext(GlobalContext);

  // console.log(Cookies.get("SpotifyAuthToken"))
  // console.log(title);
  // console.log(Cookies.get("SpotifyAuthToken"))

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    const arr:any[] = [];
    console.log(localStorage.getItem("spotifyAccessToken"))
    setTracks([]);
    context.setCanGenerateYTPlaylist();
    context.setPlaylistGenerated();
    // title
    //   ? title.map(async (singleTitle:any) => {
    //       const URL = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${
    //         singleTitle.track.name.replace(" ", "%20") +
    //         "%20" +
    //         singleTitle.track.artists[0].name.replace(" ", "%20") +
    //         "%20" +
    //         "song"
    //       }&type=video&part=snippet&maxResults=1`;
    //       // console.log(URL);
    //       await fetch(URL)
    //         .then((data) => data.json())
    //         .then((resp) => {
    //           console.log(resp);
    //           arr.push(resp);
    //           setTracks((Alltracks) => [...Alltracks, resp]);
    //         });
    //       setTimeout(() => {
    //         context.setPlaylistTracks(arr);
    //       }, 1500);
    //     })
    //   : "";
  }, [context]);

  // console.log(Alltracks.length != 0 ? Alltracks : "");
  // console.log(context.playlistTracks.length != 0 ? context.playlistTracks : "");

  return (
    <div className="max-h-48 overflow-y-visible">
      <div className="flex flex-row gap-4 items-center">
        <input
          className="p-4 rounded"
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
          className="p-4 rounded h-auto"
        //   type="text"
          name=""
          id=""
          placeholder="Playlist Desc (optional)"
          value={context.PlaylistDesc}
          disabled={Alltracks.length === 0 ? true : false}
          onChange={(e) => {
            context.setPlaylistDesc(e.target.value);
          }}
        />
      </div>

      {context.canGenerateYTPlaylist ? (
        <div>
          <p className="text-[#842a2a]">Please set playlist name</p>
        </div>
      ) : (
        ""
      )}

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
  );
}
