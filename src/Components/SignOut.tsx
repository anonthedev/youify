import { signOut } from "next-auth/react"

export default function SignOut() {
  return (
    <button
      className="py-2 px-4 bg-[#581111] text-white rounded-lg"
      onClick={()=>{
        signOut()
        localStorage.clear()
      }}
    >
      Sign out
    </button>
  )
}
