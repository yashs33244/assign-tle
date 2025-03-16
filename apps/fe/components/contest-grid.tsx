"use client"

import type { Contest, PastContest } from "@/types/contest"
import { ContestCard } from "@/components/contest-card"
import { useContestStore } from "@/store/useContestStore"

interface ContestGridProps {
  contests: (Contest | PastContest)[]
  isPastContests?: boolean
}

export function ContestGrid({ contests, isPastContests = false }: ContestGridProps) {
  const { selectedPlatforms } = useContestStore()

  const filteredContests = contests.filter(
    (contest) => selectedPlatforms.length === 0 || selectedPlatforms.includes(contest.platform),
  )

  if (filteredContests.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">
          {selectedPlatforms.length > 0 ? "No contests found for the selected platforms." : "No contests available."}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredContests.map((contest) => (
        <ContestCard key={contest.id} contest={contest} isPastContest={isPastContests} />
      ))}
    </div>
  )
}

