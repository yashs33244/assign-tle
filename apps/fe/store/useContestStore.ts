import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BookmarkRequest, Platform, Contest } from "@/types/contest";
import { bookmarkContest, fetchBookmarkedContests } from "@/lib/api";

interface ContestState {
  bookmarkedContests: string[];
  selectedPlatforms: Platform[];
  toggleBookmark: (contestId: string, bookmarked: boolean) => Promise<void>;
  togglePlatformFilter: (platform: Platform) => void;
  selectAllPlatforms: () => void;
  clearPlatformFilters: () => void;
  isBookmarked: (contestId: string) => boolean;
  syncBookmarks: (contests: { id: string; isBookmarked: boolean }[]) => void;
  refetchBookmarks: () => Promise<void>;
}

export const useContestStore = create<ContestState>()(
  persist(
    (set, get) => ({
      bookmarkedContests: [],
      selectedPlatforms: [] as Platform[],
      toggleBookmark: async (contestId: string, bookmarked: boolean) => {
        try {
          const request: BookmarkRequest = { contestId, bookmarked };
          await bookmarkContest(request);
          set((state) => {
            if (bookmarked) {
              // Only add if not already in the array
              if (!state.bookmarkedContests.includes(contestId)) {
                return {
                  bookmarkedContests: [...state.bookmarkedContests, contestId],
                };
              }
            } else {
              return {
                bookmarkedContests: state.bookmarkedContests.filter((id) => id !== contestId),
              };
            }
            return state; // Return unchanged state if no changes needed
          });
        } catch (error) {
          console.error("Failed to bookmark contest:", error);
          throw error;
        }
      },
      togglePlatformFilter: (platform: Platform) => {
        set((state) => {
          if (state.selectedPlatforms.includes(platform)) {
            return {
              selectedPlatforms: state.selectedPlatforms.filter((p) => p !== platform),
            };
          } else {
            return {
              selectedPlatforms: [...state.selectedPlatforms, platform],
            };
          }
        });
      },
      selectAllPlatforms: () => {
        const allPlatforms: Platform[] = [
          "Codeforces",
          "LeetCode",
          "HackerRank",
          "CodeChef",
          "AtCoder",
          "TopCoder",
          "Other",
        ];
        set({ selectedPlatforms: allPlatforms });
      },
      clearPlatformFilters: () => {
        set({ selectedPlatforms: [] });
      },
      isBookmarked: (contestId: string) => {
        return get().bookmarkedContests.includes(contestId);
      },
      syncBookmarks: (contests: { id: string; isBookmarked: boolean }[]) => {
        const newBookmarkedContests = contests
          .filter((contest) => contest.isBookmarked)
          .map((contest) => contest.id);
        // Only update state if the bookmarked contests have changed
        set((state) => {
          if (
            newBookmarkedContests.length === state.bookmarkedContests.length &&
            newBookmarkedContests.every((id) => state.bookmarkedContests.includes(id))
          ) {
            return state; // No change
          }
          return { bookmarkedContests: newBookmarkedContests };
        });
      },
      refetchBookmarks: async () => {
        try {
          const bookmarkedContests = await fetchBookmarkedContests();
          const bookmarkedIds = bookmarkedContests.map(contest => contest.id);
          set({ bookmarkedContests: bookmarkedIds });
        } catch (error) {
          console.error("Failed to refetch bookmarks:", error);
        }
      }
    }),
    {
      name: "contest-storage",
    },
  ),
);