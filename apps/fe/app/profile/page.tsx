"use client"

import { Navbar } from "@/components/navbar"
import { useContestStore } from "@/store/useContestStore"
import { useQuery } from "@tanstack/react-query"
import { fetchPastContests, fetchUpcomingContests } from "@/lib/api"
import { ContestGrid } from "@/components/contest-grid"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProfilePage() {
  const { bookmarkedContests } = useContestStore()

  const { data: upcomingContests = [] } = useQuery({
    queryKey: ["upcomingContests"],
    queryFn: fetchUpcomingContests,
  })

  const { data: pastContests = [] } = useQuery({
    queryKey: ["pastContests"],
    queryFn: fetchPastContests,
  })

  const bookmarkedUpcoming = upcomingContests.filter((contest) => bookmarkedContests.includes(contest.id))

  const bookmarkedPast = pastContests.filter((contest) => bookmarkedContests.includes(contest.id))

  const hasBookmarks = bookmarkedUpcoming.length > 0 || bookmarkedPast.length > 0

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
          <p className="text-muted-foreground mt-1">View and manage your bookmarked contests</p>
        </div>

        {!hasBookmarks ? (
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <h3 className="text-lg font-medium">No bookmarked contests</h3>
            <p className="text-muted-foreground mt-1">Bookmark contests to keep track of them here</p>
          </div>
        ) : (
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="upcoming">Upcoming ({bookmarkedUpcoming.length})</TabsTrigger>
              <TabsTrigger value="past">Past ({bookmarkedPast.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming">
              <ContestGrid contests={bookmarkedUpcoming} />
            </TabsContent>
            <TabsContent value="past">
              <ContestGrid contests={bookmarkedPast} isPastContests={true} />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  )
}

