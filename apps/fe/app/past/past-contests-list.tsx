"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchPastContests } from "@/lib/api"
import { ContestGrid } from "@/components/contest-grid"

export function PastContestsList() {
  const {
    data: contests,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["pastContests"],
    queryFn: fetchPastContests,
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-pulse text-center">
          <p>Loading past contests...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Error loading past contests. Please try again later.</p>
      </div>
    )
  }

  return <ContestGrid contests={contests || []} isPastContests={true} />
}

