/* eslint-disable @next/next/no-img-element */
import "./globals.css";
import SessionProviders from "./sessionProvider";
import ContextProvider from "./contextProvider";
import { Raleway } from "next/font/google";
import {Analytics} from "@vercel/analytics/react"

export const metadata = {
  title: "Youify",
  description: "Convert playlist from one platform to another",
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
