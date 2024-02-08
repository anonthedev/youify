import NextAuth from "next-auth";
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

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
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
      session.user.googleAccessToken = token.googleAccessToken;
      session.user.googleRefreshToken = token.googleRefreshToken;
      session.user.googleUsername = token.googleUsername;
      return session;
    },
  },
});
