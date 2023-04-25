"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function LandingPage() {
  const LSAvailable = typeof window !== "undefined";
  const { data: session } = useSession();
//   console.log(session);
  useEffect(() => {
    if (LSAvailable && session) {
      if (
        session.user.googleAccessToken &&
        localStorage.getItem("spotifyAccessToken")
      ) {
        redirect("/converter")
      }
    }
  });

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <div className="flex flex-col gap-6 justify-center items-center">
        <h1 className="text-5xl font-bold font-raleway text-[#FFC42C] mb-2 text-center">
          YouIfy
        </h1>
        <p className="max-w-[40ch] text-center">
          Ship your playlists from{" "}
          <span className="text-spotify-green">Spotify</span> to{" "}
          <span className="text-youtube-red">YouTube</span> and vice versa with
          Youify
        </p>
        <div className="flex flex-row gap-4">
          <Link href={"/spotifyLogin"}>
            <button className="px-8 py-4 rounded text-black font-bold font-raleway bg-[#FFC42C]">
              Let&apos;s get you started
            </button>
          </Link>
        </div>
      </div>
      <div className="mt-4 text-gray-600 text-sm">
        By continuing you agree with our{" "}
        <Link href={"/privacyPolicy"} target="_blank">
          <span className="underline text-blue-800">Privacy Policy</span>
        </Link>
      </div>
      <div className="max-w-prose text-center text-gray-600 text-xs absolute bottom-0 mb-2 font-medium">
        Youify&apos;s use and transfer to any other app of information received
        from Google APIs will adhere to{" "}
        <a
          target="_blank"
          href="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes"
          className="underline text-blue-800"
        >
          Google API Services User Data Policy
        </a>
        , including the Limited Use requirements.
      </div>
    </div>
  );
}
