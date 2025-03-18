

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


export const ALL_PLATFORMS = [
  "Codeforces",
  "LeetCode",
  "HackerRank",
  "CodeChef", 
  "AtCoder",
  "TopCoder",
  "Other",
] as const;

export type Platform = typeof ALL_PLATFORMS[number];

export interface Contest {
  id: string;
  name: string;
  platform: Platform;
  startTime: string;
  endTime: string;
  url: string;
  isBookmarked?: boolean;
}

export interface BookmarkRequest {
  contestId: string;
  bookmarked: boolean;
}