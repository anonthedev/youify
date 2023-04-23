"use client"

import Link from "next/link";
import { Inter } from "next/font/google";
import { useSession } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const {data: session} = useSession()

console.log(session)
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold font-['Ubuntu'] text-[#FFC42C] mb-2 text-center">
        YouIfy
      </h1>
      <p>Let&apos;s get you setup</p>
      <div className="flex flex-row gap-4 mt-10">
        <Link href={"/spotifyLogin"}>
          <button className="px-8 py-4 rounded text-black font-medium font-['Ubuntu'] bg-[#FFC42C]">
            Let&apos;s get you started
          </button>
        </Link>
      </div>
    </div>
  );
}
