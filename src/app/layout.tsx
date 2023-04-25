import "./globals.css";
import SessionProviders from "./sessionProvider";
import ContextProvider from "./contextProvider";
import { Raleway } from "next/font/google";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const raleway = Raleway({
  variable: '--font-raleway',
  subsets: ["latin"],
  display: 'swap',
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
      </body>
    </html>
  );
}
