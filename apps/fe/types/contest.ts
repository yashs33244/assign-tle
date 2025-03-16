export type Platform = "Codeforces" | "LeetCode" | "HackerRank" | "CodeChef" | "AtCoder" | "TopCoder" | "Other"

export interface Contest {
  id: string
  name: string
  platform: Platform
  url: string
  startTime: string // ISO date string
  endTime: string // ISO date string
  duration: number // in minutes
  isBookmarked?: boolean
}

export interface PastContest extends Contest {
  pcdLink?: string // YouTube link to Problem Solving/Discussion
}

export interface BookmarkRequest {
  contestId: string
  bookmarked: boolean
}

export interface PCDLinkRequest {
  contestId: string
  pcdLink: string
}

