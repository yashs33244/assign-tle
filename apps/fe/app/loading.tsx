import { Navbar } from "@/components/navbar"
import { ContestGridSkeleton } from "@/components/loading-skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-6">
        <div className="mb-6">
          <div className="h-8 w-48 bg-muted rounded animate-pulse"></div>
          <div className="h-4 w-64 bg-muted rounded mt-2 animate-pulse"></div>
        </div>

        <div className="mb-4">
          <div className="h-9 w-36 bg-muted rounded animate-pulse"></div>
        </div>

        <ContestGridSkeleton />
      </main>
    </div>
  )
}

