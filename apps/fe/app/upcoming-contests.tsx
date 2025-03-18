"use client";

import { useState, useEffect } from "react";
import { Contest, PastContest } from "@/types/contest";

import { ContestGrid } from "@/components/contest-grid";
import { FilterBar } from "@/components/filter-bar";
import { useContestStore } from "@/store/useContestStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchUpcomingContests } from "@/lib/api";

export default function ContestsPage() {
  const [upcomingContests, setUpcomingContests] = useState<Contest[]>([]);
  const [pastContests, setPastContests] = useState<PastContest[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedPlatforms, bookmarkedContests, syncBookmarks } =
    useContestStore();

  useEffect(() => {
    const loadContests = async () => {
      setLoading(true);
      try {
        const data = await fetchUpcomingContests();

        // Sort contests into upcoming and past, and mark bookmarked
        const now = new Date();
        const upcoming: Contest[] = [];
        const past: PastContest[] = [];

        data.forEach((contest) => {
          const enrichedContest = {
            ...contest,
            isBookmarked: bookmarkedContests.includes(contest.id),
          };

          const endTime = contest.endTime
            ? new Date(contest.endTime)
            : new Date(
                new Date(contest.startTime).getTime() +
                  (contest.duration || 0) * 60000
              );

          if (endTime > now) {
            upcoming.push(enrichedContest);
          } else {
            past.push(enrichedContest as PastContest);
          }
        });

        // Sort upcoming contests by start time (ascending)
        upcoming.sort(
          (a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );

        // Sort past contests by start time (descending)
        past.sort(
          (a, b) =>
            new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        );

        setUpcomingContests(upcoming);
        setPastContests(past);

        // Keep store in sync with data from API
        syncBookmarks([...upcoming, ...past]);
      } catch (error) {
        console.error("Failed to fetch contests:", error);
      } finally {
        setLoading(false);
      }
    };

    loadContests();
  }, [bookmarkedContests, syncBookmarks]);

  // Filter contests based on selected platforms
  const filteredUpcomingContests = upcomingContests.filter(
    (contest) =>
      selectedPlatforms.length === 0 ||
      selectedPlatforms.includes(contest.platform)
  );

  const filteredPastContests = pastContests.filter(
    (contest) =>
      selectedPlatforms.length === 0 ||
      selectedPlatforms.includes(contest.platform)
  );

  if (loading) {
    return <div className="text-center py-8">Loading contests...</div>;
  }

  return (
    <div className="container mx-auto space-y-4">
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming Contests ({filteredUpcomingContests.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past Contests ({filteredPastContests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4">
          <ContestGrid contests={filteredUpcomingContests} />
        </TabsContent>

        <TabsContent value="past" className="mt-4">
          <ContestGrid contests={filteredPastContests} isPastContests={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
