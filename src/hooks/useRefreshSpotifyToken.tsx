import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function useRefreshSpotifyToken() {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;
  const redirectURI = "http://localhost:3000/spotifyLogin/";
  const LSAvailabe = typeof window !== "undefined";
  const currentDate = new Date();
  const TOKEN = "https://accounts.spotify.com/api/token";
  let refreshToken;
  let accessToken;
  useEffect(() => {
    // console.log(localStorage.getItem("refreshToken"))
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
        // redirect("/googleLogin");
        // console.log(localStorage.getItem("spotifyAccessToken"));
      }
    }
  }, [LSAvailabe, currentDate]);
  function callAuthorizationApi(body: any) {
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
      // console.log(data);
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
      }
      // onPageLoad();
    } else {
      console.log(this.responseText);
      // alert(this.responseText);
    }
  }
  return accessToken;
}
