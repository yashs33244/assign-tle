import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { FilterBar } from "@/components/filter-bar"
import { PastContestsList } from "@/app/past/past-contests-list"

export default function PastContestsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Past Contests</h1>
          <p className="text-muted-foreground mt-1">Browse past contests with problem solving videos</p>
        </div>

        <FilterBar />

        <Suspense fallback={<div>Loading past contests...</div>}>
          <PastContestsList />
        </Suspense>
      </main>
    </div>
  )
}

