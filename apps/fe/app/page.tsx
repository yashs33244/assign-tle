import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { FilterBar } from "@/components/filter-bar"
import { UpcomingContests } from "@/app/upcoming-contests"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Upcoming Contests</h1>
          <p className="text-muted-foreground mt-1">Browse and bookmark upcoming programming contests</p>
        </div>

        <FilterBar />

        <Suspense fallback={<div>Loading contests...</div>}>
          <UpcomingContests />
        </Suspense>
      </main>
    </div>
  )
}

