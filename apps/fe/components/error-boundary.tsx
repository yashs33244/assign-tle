"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const handleError = () => {
      setHasError(true)
    }

    window.addEventListener("error", handleError)

    return () => {
      window.removeEventListener("error", handleError)
    }
  }, [])

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <p className="text-muted-foreground mb-6">We're sorry, but there was an error loading this content.</p>
        <Button onClick={() => window.location.reload()}>Try again</Button>
      </div>
    )
  }

  return <>{children}</>
}

