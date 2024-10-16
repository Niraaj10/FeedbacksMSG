'use client'

import { useSession, signIn, signOut } from "next-auth/react"

const page = () => {
    const { data: session } = useSession()

    if (session) {
        return (
            <>
            Signed in as {session.user.email} <br/>
            <button onClick={() => signOut()}>Sign out</button>
            </>
        )
    }
  return (
    <div>
      Not signed in
      <button onClick={() => signIn()}>Sign In</button>
    </div>
  )
}

export default page
