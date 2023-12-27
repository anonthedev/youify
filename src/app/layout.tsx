/* eslint-disable @next/next/no-img-element */
import "./globals.css";
import SessionProviders from "./sessionProvider";
import ContextProvider from "./contextProvider";
import { Raleway } from "next/font/google";
import {Analytics} from "@vercel/analytics/react"

export const metadata = {
  title: "Youify",
  description: "Convert playlist from one platform to another",
  keywords: [
  "YouTube to Spotify converter",
  "Spotify to YouTube playlist migration",
  "Playlist conversion tool",
  "Seamless playlist transfer",
  "Cross-platform playlist conversion",
  "Youify playlist converter",
  "YouTube playlist exporter",
  "Spotify playlist importer",
  "Bulk playlist conversion",
  "User-friendly playlist tool",
  "Playlist migration service",
  "Music streaming playlist converter",
  "Convert YouTube playlists to Spotify",
  "Transfer Spotify playlists to YouTube",
  "Online playlist conversion tool",
  "Playlist format conversion",
  "Effortless playlist switch",
  "Preview playlists before conversion",
  "Playlist data privacy",
  "Secure playlist conversion",
  "Playlist management tool",
  "Playlist order preservation",
  "Instant playlist preview",
  "Youify updates and features",
  "Playlist conversion community",
  "Playlist conversion tips",
  "Youify support and feedback",
  "Convert multiple playlists at once",
  "Playlist conversion service",
  "YouTube and Spotify integration",
  "Playlist converter online",
  "Convert music playlists easily",
  "Playlist conversion for music lovers",
  "Playlist migration made simple",
  "User-friendly playlist conversion",
  "Intuitive playlist tool",
  "Playlist conversion software",
  "Playlist converter technology",
  "Online music playlist converter",
  "Best playlist conversion service",
  "Playlist conversion expertise",
  "Playlist conversion innovation",
  "Latest playlist conversion trends",
  "Youify social media updates",
  "Connect with Youify community",
  "Youify on Facebook, Twitter, Instagram",
  "Playlist converter disclaimer",
  "Independent playlist conversion tool",
  "Not affiliated with YouTube or Spotify"
]

};

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${raleway.variable}`}>
      <body className="bg-black text-white font-raleway">
        <ContextProvider>
          <SessionProviders>{children}</SessionProviders>
        </ContextProvider>
        <div className="w-fit fixed bottom-0 right-0 py-4 px-2 md:px-0">
          <a
            href="https://www.producthunt.com/products/youify/reviews?utm_source=badge-product_review&utm_medium=badge&utm_souce=badge-youify"
            target="_blank"
          >
            <img
              src="https://api.producthunt.com/widgets/embed-image/v1/product_review.svg?product_id=520846&theme=dark"
              alt="Youify - Convert&#0032;YouTube&#0032;playlists&#0032;to&#0032;Spotify&#0032;in&#0032;seconds | Product Hunt"
              className={`w-[250px] h-[50px] md:w-[200px] md:h-[35px]`}
            />
          </a>
        </div>
        <Analytics/>
      </body>
    </html>
  );
}
