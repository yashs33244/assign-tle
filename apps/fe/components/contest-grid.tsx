"use client";
import { Contest, PastContest } from "@/types/contest";
import { ContestCard } from "./contest-card";

interface ContestGridProps {
  contests: (Contest | PastContest)[];
  pcdLinks?: Record<string, string>;
  isPastContests?: boolean;
}

export function ContestGrid({
  contests,
  pcdLinks = {},
  isPastContests = false,
}: ContestGridProps) {
  if (contests.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/20">
        <h3 className="text-lg font-medium">No contests found</h3>
        <p className="text-muted-foreground mt-1">
          {isPastContests
            ? "No past contests available at the moment."
            : "Try adjusting your filters or check back later for more contests."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {contests.map((contest) => (
        <ContestCard
          key={contest.id}
          contest={contest}
          pcdLink={pcdLinks[contest.id]}
          isPastContest={isPastContests}
          initialBookmarked={
            "isBookmarked" in contest ? contest.isBookmarked : undefined
          }
        />
      ))}
    </div>
  );
}
