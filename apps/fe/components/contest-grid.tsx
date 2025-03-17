import { Contest, PastContest } from "@/types/contest";
import { ContestCard } from "@/components/contest-card";

interface ContestGridProps {
  contests: Contest[] | PastContest[];
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
            ? "You haven't bookmarked any past contests."
            : "You haven't bookmarked any upcoming contests."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contests.map((contest) => (
        <ContestCard
          key={contest.id}
          contest={contest}
          pcdLink={pcdLinks[contest.id]}
          isPastContest={isPastContests}
        />
      ))}
    </div>
  );
}
