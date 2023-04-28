"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
// import spotifyLogo from "./resources/spotifyLogo.png";
import Image from "next/image";
import { redirect } from "next/navigation";
// import SignOut from "./SignOut";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
  // const spotify = useSpotify()
  const pathname = usePathname();
  const AUTHORIZE = "https://accounts.spotify.com/authorize";
  const TOKEN = "https://accounts.spotify.com/api/token";
  const scopes = [
    "playlist-read-private",
    "playlist-read-collaborative",
    "playlist-modify-private",
    "playlist-modify-public",
  ].join(",");
  const LSAvailabe = typeof window !== "undefined";
  // LSAvailabe ? console.log(localStorage.getItem("spotifyAccessToken")) : ""
  // const { data: session, status } = useSession();
  // // console.log(spotify);
  // if (status === "authenticated") {
  //   // localStorage.setItem("spotifyName", session.user.name);
  //   // localStorage.setItem("spotifyEmail", session.user.email);
  //   // localStorage.setItem("spotifyUsername", session.user.spotifyUsername);
  //   console.log(session);
  //   signOut()
  //   // redirect("/googleLogin");
  // }
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;
  const redirectURI = "http://localhost:3000/spotifyLogin/";
  const currentDate = new Date();
  let refreshToken;
  let accessToken;
  // let spotifyToken = ;
  // let checkLogin;
  // useEffect(() => {
  //   if (LSAvailabe) {
  //     if (localStorage.getItem("spotifyAccessToken")) {
  //       redirect(`/googleLogin`);
  //     }
  //   }
  // }, [LSAvailabe]);

  useEffect(() => {
    function spotifyLogin() {
      let code = getCode();
      if (code) {
        window.location.replace("/spotifyLogin")
        fetchAccessToken(code);
      }
    }
    spotifyLogin();
  });

  useEffect(() => {
    function refreshAccessToken() {
      refreshToken = localStorage.getItem("spotifyRefreshToken");
      let body = "grant_type=refresh_token";
      body += "&refresh_token=" + refreshToken;
      body += "&client_id=" + clientId;
      callAuthorizationApi(body);
    }
    if (LSAvailabe) {
      const expireDate = new Date(localStorage.getItem("spotifyTokenExpire")!);
      if (currentDate > expireDate) {
        refreshAccessToken();
      } else if (currentDate < expireDate) {
        redirect("/googleLogin");
        // console.log(localStorage.getItem("spotifyAccessToken"));
      }
    }
  }, [LSAvailabe, currentDate]);

  function getCode() {
    let code = null;
    const queryString = window.location.search;
    if (queryString.length > 0) {
      const urlParams = new URLSearchParams(queryString);
      code = urlParams.get("code");
    }
    return code;
  }

  function fetchAccessToken(code: any) {
    let body = "grant_type=authorization_code";
    body += "&code=" + code;
    body += "&redirect_uri=" + encodeURI(redirectURI);
    body += "&client_id=" + clientId;
    body += "&client_secret=" + clientSecret;
    callAuthorizationApi(body);
    // console.log(body);
  }

  function callAuthorizationApi(body: any) {
    // fetch(`${TOKEN}`, {
    //   method: "POST",
    //   headers: {
    //     Authorization: "Basic " + window.btoa(clientId + ":" + clientId),
    //   },
    //   body: body,
    // })
    //   .then((data) => data.json())
    //   .then((resp) => {
    //     console.log(resp);
    //   });
    let xhr = new XMLHttpRequest();
    xhr.open("POST", TOKEN, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader(
      "Authorization",
      "Basic " + window.btoa(clientId + ":" + clientSecret)
    );
    xhr.send(body);
    xhr.onload = handleAuthorizationResponse;
  }

  function handleAuthorizationResponse(this: any) {
    if (this.status == 200) {
      let data = JSON.parse(this.responseText);
      console.log(data);
      currentDate.setTime(currentDate.getTime() + 1 * 60 * 60 * 1000);
      localStorage.setItem("spotifyTokenExpire", currentDate.toString());
      // var data = JSON.parse(this.responseText);
      if (data.access_token != undefined) {
        accessToken = data.access_token;
        localStorage.setItem("spotifyAccessToken", accessToken);
      }
      if (data.refresh_token != undefined) {
        refreshToken = data.refresh_token;
        localStorage.setItem("spotifyRefreshToken", refreshToken);
        // window.location.replace("/googleLogin")
      } else {
        console.log(this.responseText);
        // alert(this.responseText);
      }
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
            Convert your YouTube playlist to Spotify in seconds.
          </p>
        </div>
        <Link
          href={`${AUTHORIZE}?client_id=${clientId}&response_type=code&redirect_uri=${redirectURI}&show_dialog=true&scope=${scopes}`}
        >
          <button
            className="flex flex-row py-2 px-6 items-center bg-[#1bc257] rounded text-black font-[500] font-raleway"
            // onClick={() => {
            //   spotifyLogin();
            // }}
          >
            {/* <Image src={spotifyLogo} alt="" width={50} height={50}></Image> */}
            Sign in with Spotify
          </button>
        </Link>
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
