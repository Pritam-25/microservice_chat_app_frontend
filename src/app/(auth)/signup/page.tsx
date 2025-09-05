"use client"
import { useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { SignUpForm } from "@/app/(auth)/components/signup-form";

export default function SignUpPage() {
  const router = useRouter()

  useEffect(() => {
    let active = true
      ; (async () => {
        try {
          await axios.get("http://localhost:5000/auth/v1/me", { withCredentials: true })
          if (!active) return
          router.replace("/chat")
        } catch {
          // not logged in -> stay on page
        }
      })()
    return () => { active = false }
  }, [router])
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <SignUpForm />
      </div>
    </div>
  )
}
