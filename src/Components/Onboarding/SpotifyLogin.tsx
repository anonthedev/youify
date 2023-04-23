"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
// import spotifyLogo from "./resources/spotifyLogo.png";
import Image from "next/image";
import { redirect } from "next/navigation";
// import SignOut from "./SignOut";
import useSpotify from "@/hooks/useSpotify";

export default function Login() {
  // const spotify = useSpotify()
  // console.log(localStorage.getItem("spotifyAccessToken"))
  const { data: session, status } = useSession();
  // console.log(spotify);
  if (status === "authenticated") {
    // localStorage.setItem("spotifyName", session.user.name);
    // localStorage.setItem("spotifyEmail", session.user.email);
    // localStorage.setItem("spotifyUsername", session.user.spotifyUsername);
    // console.log(session);
    // signOut()
    redirect("/googleLogin");
  }
  return (
    <section className="h-screen flex flex-col items-center">
      <div className="w-screen h-[calc(100vh-100px)] flex flex-col items-center justify-center">
        <div className="flex flex-col justify-center items-center mb-10">
          <h1 className="text-5xl font-bold font-['Ubuntu'] text-[#FFC42C] mb-2 text-center">
            YouIfy
          </h1>
          <p className="text-center font-['Ubuntu'] font-light">
            Convert your YouTube playlist to Spotify in seconds.
          </p>
        </div>
        <button
          className="flex flex-row py-2 px-6 items-center bg-[#1bc257] rounded text-black font-[500] font-raleway"
          onClick={() => {
            signIn("spotify");
          }}
        >
          {/* <Image src={spotifyLogo} alt="" width={50} height={50}></Image> */}
          Sign in
          with Spotify
        </button>
      </div>
      <div className="flex flex-col text-center gap-4">
        <p>Step 1 of 2</p>
        <p className="max-w-prose text-gray-500 text-xs">
          Spotify needs authentication for even the most basic features hence
          you will have to login from both Spotify and Google
        </p>
      </div>
    </section>
  );
}
