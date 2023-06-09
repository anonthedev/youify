"use client";

import googleLogo from "../resources/images/g-logo.png";
import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import useSpotify from "@/hooks/useSpotify";

export default function GoogleLogin() {
const LSAvailable = typeof window !== "undefined"

// LSAvailable ? console.log(localStorage.getItem("spotifyAccessToken")) : ""
  // const spotify = useSpotify()
  const { data: session, status } = useSession();
  // console.log(spotify);
  if (session) {
    if (session.user.googleAccessToken) {
        // localStorage.setItem("googleName", session.user.name);
        // localStorage.setItem("googleEmail", session.user.email);
        // localStorage.setItem("googleUsername", session.user.googleUsername);
        // localStorage.setItem("googleAccessToken", session.user.googleAccessToken);
        // console.log(session);
        // signOut()
        redirect("/converter");
      }
  }

  return (
    <section className="h-screen flex flex-col items-center">
      <div className="w-screen h-[calc(100vh-100px)] flex flex-col items-center justify-center">
        <div className="flex flex-col justify-center items-center mb-10">
          <h1 className="text-5xl font-bold font-raleway text-[#FFC42C] mb-2 text-center">
            YouIfy
          </h1>
          <p className="text-center font-raleway font-light">
            Make your playlists travel.
          </p>
        </div>
        <button
          onClick={() => {
            signIn("google");
          }}
          className="flex flex-row gap-4 items-center justify-center px-8 py-4 rounded text-black font-semibold font-raleway bg-white"
        >
          <Image src={googleLogo} alt="" width={30} height={30} />
          Sign In With Google
        </button>
        <div className="mt-4">
          I just want to convert from{" "}
          <Link href={"/converter"}>
            <span className="text-blue-800 underline">YouTube to Spotify</span>
          </Link>{" "}
          as of now.
        </div>
      </div>
      <div className="flex flex-col text-center gap-4">
        <p>Step 2 of 2</p>
        <p className="max-w-prose text-gray-500 text-xs">
          Google authentication is required for converting Spotify playlists to
          YouTube and also is useful to retrieve private playlists.
        </p>
      </div>
    </section>
  );
}
