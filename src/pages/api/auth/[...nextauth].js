import NextAuth from "next-auth";
// import SpotifyProvider from "next-auth/providers/spotify";
// import spotifyApi, { LOGIN_URL } from "../../../lib/spotify";
import GoogleProvider from "next-auth/providers/google";

const GOOGLE_AUTHORIZATION_URL =
  "https://accounts.google.com/o/oauth2/v2/auth?" +
  new URLSearchParams({
    prompt: "consent",
    access_type: "offline",
    response_type: "code",
    scope: "openid https://www.googleapis.com/auth/youtube.force-ssl",
  });

let acc_provider;

const LSAvailabe = typeof window !== "undefined";

async function refreshGoogleAccessToken(token) {
  try {
    const url =
      "https://oauth2.googleapis.com/token?" +
      new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: token.googleRefreshToken,
      });

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      googleAccessToken: refreshedTokens.access_token,
      googleAccessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      googleRefreshToken:
        refreshedTokens.refresh_token ?? token.googleRefreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

// async function refreshSpotifyAccessToken(token) {
//   // console.log(token);
//   try {
//     spotifyApi.setAccessToken(token.spotifyAccessToken);
//     spotifyApi.setRefreshToken(token.spotifyRefreshToken);

//     const { body: refreshedToken } = await spotifyApi.refreshAccessToken();
//     console.log("REFRESHED TOKEN IS", refreshedToken);
//     spotify_access_token = refreshedToken.access_token;
//     return {
//       ...token,
//       spotifyAccessToken: refreshedToken.access_token,
//       spotifyAccessTokenExpires: Date.now() + refreshedToken.expires_in * 1000, // = 1 hour as 3600 returns from spotify API,
//       spotifyRefreshToken:
//         refreshedToken.refresh_token ?? token.spotifyRefreshToken, // Replace if new one came back else fall back to old refresh token
//     };
//   } catch (error) {
//     console.log(error);

//     return {
//       ...token,
//       error: "RefreshAccessTokenError",
//     };
//   }
// }

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    // SpotifyProvider({
    //   clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
    //   clientSecret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET,
    //   allowDangerousEmailAccountLinking: true,
    //   authorization: LOGIN_URL,
    // }),
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
      // scope: "",
      allowDangerousEmailAccountLinking: true,
      authorization: {
        url: GOOGLE_AUTHORIZATION_URL,
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: ["openid https://www.googleapis.com/auth/youtube.force-ssl"],
        },
      },
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  callbacks: {
    async jwt({ token, account, user }) {
      // initial sign in
      if (account && user) {
        acc_provider = account.provider;
        // Check if there are existing tokens for each provider

        // if (account.provider === "spotify") {
        //   return {
        //     ...token,
        //     spotifyAccessToken: account.access_token,
        //     spotifyRefreshToken: account.refresh_token,
        //     spotifyUsername: account.providerAccountId,
        //     spotifyAccessTokenExpires: account.expires_at * 1000, // we are handling expiry times in Milliseconds hence * 1000
        //   };}
        if (account.provider === "google") {
          return {
            ...token,
            googleAccessToken: account.access_token,
            googleRefreshToken: account.refresh_token,
            googleUsername: account.providerAccountId,
            googleAccessTokenExpires: account.expires_at * 1000, // we are handling expiry times in Milliseconds hence * 1000
          };
        }
      }
      // console.log(token);
      // const spotifyToken = token.providers?.spotify;
      // const googleToken = token.providers?.google;
      // console.log(token)
      // if (token.spotifyAccessTokenExpires) {
      //   if (Date.now() < token.spotifyAccessTokenExpires) {
      //     console.log("EXISTING SPOTIFY ACCESS TOKEN IS VALID");
      //     return token;
      //   } else {
      //     // Access token has expired, we need to refresh it...
      //     console.log("SPOTIFY ACCESS TOKEN HAS EXPIRED, REFRESHING...");
      //     return await refreshSpotifyAccessToken(token);
      //   }
      // }

      if (token.googleAccessTokenExpires) {
        if (Date.now() < token.googleAccessTokenExpires) {
          console.log("EXISTING GOOGLE ACCESS TOKEN IS VALID");
          return token;
        } else {
          // Access token has expired, we need to refresh it...
          console.log("GOOGLE ACCESS TOKEN HAS EXPIRED, REFRESHING...");
          return await refreshGoogleAccessToken(token);
        }
      }
    },

    async session({ session, token }) {
      session.accProvider = acc_provider;
      // session.user.spotify = token.spotify
      // session.user.google = token.google
      // session.user.spotifyAccessToken = token.spotifyAccessToken;
      // session.user.spotifyRefreshToken = token.spotifyRefreshToken;
      // session.user.spotifyUsername = token.spotifyUsername;
      session.user.googleAccessToken = token.googleAccessToken;
      session.user.googleRefreshToken = token.googleRefreshToken;
      session.user.googleUsername = token.googleUsername;
      // session.user = token

      return session;
    },
  },
  // events: {
  //   async linkAccount({ user, account, profile }) {
  //     if (user && account) {
  //       // console.log(user, account, profile);

  //       // console.log("xa");
  //     }
  //   },
  // },
});
