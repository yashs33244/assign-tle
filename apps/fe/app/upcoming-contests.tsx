// app/upcoming-contests.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchUpcomingContests } from "@/lib/api";
import { ContestGrid } from "@/components/contest-grid";
import { useEffect } from "react";
import { useContestStore } from "@/store/useContestStore";

export function UpcomingContests() {
  const {
    data: contests,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["upcomingContests"],
    queryFn: fetchUpcomingContests,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const { selectAllPlatforms } = useContestStore();

  useEffect(() => {
    selectAllPlatforms();
  }, [selectAllPlatforms]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-pulse text-center">
          <p>Loading contests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">
          Error loading contests. Please try again later.
        </p>
      </div>
    );
  }

  // Make sure contests is always an array, even if undefined
  return <ContestGrid contests={contests || []} />;
}

export default UpcomingContests;
