"use client";

import type { Contest, PastContest } from "@/types/contest";
import { ContestCard } from "@/components/contest-card";
import { useContestStore } from "@/store/useContestStore";

interface ContestGridProps {
  contests: Contest[] | { contests: Contest[] };
}

export function ContestGrid({ contests }: ContestGridProps) {
  const { selectedPlatforms } = useContestStore();
  // const isPastContests = contests[0] && contests[0].isPast;

  // Handle both direct array or object with contests property
  const contestsArray = Array.isArray(contests)
    ? contests
    : contests.contests || [];

  const filteredContests = contestsArray.filter(
    (contest) =>
      selectedPlatforms.length === 0 ||
      selectedPlatforms.includes(contest.platform)
  );

  if (filteredContests.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">
          {selectedPlatforms.length > 0
            ? "No contests found for the selected platforms."
            : "No contests available."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredContests.map((contest) => (
        <ContestCard key={contest.id} contest={contest} isPastContest={false} />
      ))}
    </div>
  );
}
