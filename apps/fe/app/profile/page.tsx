"use client";
import { Navbar } from "@/components/navbar";
import { useQuery } from "@tanstack/react-query";
import {
  fetchBookmarkedContests,
  fetchPCDLinks,
  fetchPastContests,
} from "@/lib/api";
import { ContestGrid } from "@/components/contest-grid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContestStore } from "@/store/useContestStore";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { syncBookmarks, isBookmarked } = useContestStore();
  const [activeTab, setActiveTab] = useState("upcoming");

  // Fetch bookmarked contests
  const {
    data: bookmarkedContests = [],
    isLoading: isBookmarkedLoading,
    isError: isBookmarkedError,
  } = useQuery({
    queryKey: ["bookmarkedContests"],
    queryFn: fetchBookmarkedContests,
  });

  // Fetch all past contests
  const {
    data: pastContestsData = { contests: [] },
    isLoading: isPastLoading,
    isError: isPastError,
  } = useQuery({
    queryKey: ["pastContests"],
    queryFn: fetchPastContests,
    // Only fetch past contests when the "past" tab is active to save resources
    enabled: activeTab === "past",
  });

  const { data: pcdLinks = {} } = useQuery({
    queryKey: ["pcdLinks"],
    queryFn: fetchPCDLinks,
  });

  // Sync bookmarks with the store when data is loaded
  useEffect(() => {
    if (bookmarkedContests.length > 0) {
      syncBookmarks(
        bookmarkedContests.map((contest) => ({
          id: contest.id,
          isBookmarked: true,
        }))
      );
    }
  }, [bookmarkedContests, syncBookmarks]);

  // Separate upcoming and past bookmarked contests
  const now = new Date();
  const bookmarkedUpcoming = bookmarkedContests.filter(
    (contest) => new Date(contest.startTime) > now
  );

  // Process past contests data to include bookmark status
  const pastContests = pastContestsData.contests
    ? pastContestsData.contests.map((contest: any) => ({
        ...contest,
        isBookmarked: isBookmarked(contest.id),
      }))
    : [];

  const hasBookmarkedUpcoming = bookmarkedUpcoming.length > 0;
  const hasPastContests = pastContests && pastContests.length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
          <p className="text-muted-foreground mt-1">
            View your bookmarked contests and browse past contests
          </p>
        </div>

        <Tabs
          defaultValue="upcoming"
          className="w-full"
          onValueChange={(value) => setActiveTab(value)}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="upcoming">
              Bookmarked Contests{" "}
              {hasBookmarkedUpcoming ? `(${bookmarkedUpcoming.length})` : ""}
            </TabsTrigger>
            <TabsTrigger value="past">Past Contests</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {isBookmarkedLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : isBookmarkedError ? (
              <div className="text-center py-12 border rounded-lg bg-muted/20">
                <h3 className="text-lg font-medium">Error loading bookmarks</h3>
                <p className="text-muted-foreground mt-1">
                  Please try again later
                </p>
              </div>
            ) : !hasBookmarkedUpcoming ? (
              <div className="text-center py-12 border rounded-lg bg-muted/20">
                <h3 className="text-lg font-medium">No bookmarked contests</h3>
                <p className="text-muted-foreground mt-1">
                  Bookmark contests to keep track of them here
                </p>
              </div>
            ) : (
              <ContestGrid contests={bookmarkedUpcoming} pcdLinks={pcdLinks} />
            )}
          </TabsContent>

          <TabsContent value="past">
            {isPastLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : isPastError ? (
              <div className="text-center py-12 border rounded-lg bg-muted/20">
                <h3 className="text-lg font-medium">
                  Error loading past contests
                </h3>
                <p className="text-muted-foreground mt-1">
                  Please try again later
                </p>
              </div>
            ) : !hasPastContests ? (
              <div className="text-center py-12 border rounded-lg bg-muted/20">
                <h3 className="text-lg font-medium">No past contests found</h3>
                <p className="text-muted-foreground mt-1">
                  Check back later for past contests
                </p>
              </div>
            ) : (
              <ContestGrid
                contests={pastContests}
                pcdLinks={pcdLinks}
                isPastContests={true}
              />
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
