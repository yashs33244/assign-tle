// app/page.tsx
import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { FilterBar } from "@/components/filter-bar";
import { ClientUpcomingContests } from "./client-upcoming-contests";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Upcoming Contests
          </h1>
          <p className="text-muted-foreground mt-1">
            Browse and bookmark upcoming programming contests
          </p>
        </div>

        <FilterBar />

        <div className="mt-6">
          <Suspense
            fallback={
              <div className="flex justify-center items-center py-12">
                <div className="animate-pulse text-center">
                  <p>Loading contests...</p>
                </div>
              </div>
            }
          >
            <ClientUpcomingContests />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
