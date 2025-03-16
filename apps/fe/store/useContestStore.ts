import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { BookmarkRequest, Platform } from "@/types/contest"
import { bookmarkContest } from "@/lib/api"

interface ContestState {
  bookmarkedContests: string[]
  selectedPlatforms: Platform[]
  toggleBookmark: (contestId: string, bookmarked: boolean) => Promise<void>
  togglePlatformFilter: (platform: Platform) => void
  selectAllPlatforms: () => void
  clearPlatformFilters: () => void
  isBookmarked: (contestId: string) => boolean
}

export const useContestStore = create<ContestState>()(
  persist(
    (set, get) => ({
      bookmarkedContests: [],
      selectedPlatforms: [] as Platform[],

      toggleBookmark: async (contestId: string, bookmarked: boolean) => {
        try {
          const request: BookmarkRequest = { contestId, bookmarked }
          await bookmarkContest(request)

          set((state) => {
            if (bookmarked) {
              return {
                bookmarkedContests: [...state.bookmarkedContests, contestId],
              }
            } else {
              return {
                bookmarkedContests: state.bookmarkedContests.filter((id) => id !== contestId),
              }
            }
          })
        } catch (error) {
          console.error("Failed to bookmark contest:", error)
          throw error
        }
      },

      togglePlatformFilter: (platform: Platform) => {
        set((state) => {
          if (state.selectedPlatforms.includes(platform)) {
            return {
              selectedPlatforms: state.selectedPlatforms.filter((p) => p !== platform),
            }
          } else {
            return {
              selectedPlatforms: [...state.selectedPlatforms, platform],
            }
          }
        })
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
        ]
        set({ selectedPlatforms: allPlatforms })
      },

      clearPlatformFilters: () => {
        set({ selectedPlatforms: [] })
      },

      isBookmarked: (contestId: string) => {
        return get().bookmarkedContests.includes(contestId)
      },
    }),
    {
      name: "contest-storage",
    },
  ),
)

