import type { BookmarkRequest, Contest, PCDLinkRequest, PastContest } from "@/types/contest"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

export async function fetchUpcomingContests() {
  const response = await fetch(`${API_BASE_URL}/contests/upcoming`);
  const data = await response.json();
  return data.contests; 
}

export async function fetchPastContests() {
  const response = await fetch(`${API_BASE_URL}/contests/past/all`);
  if (!response.ok) {
    throw new Error("Failed to fetch past contests");
  }
  const data = await response.json();
  return data; 
}

export async function fetchPCDLinks(): Promise<Record<string, string>> {
  const response = await fetch(`${API_BASE_URL}/pcd/contests`);
  if (!response.ok) {
    throw new Error("Failed to fetch PCD links");
  }
  return response.json();
}

export async function fetchBookmarkedContests(): Promise<Contest[]> {
  const response = await fetch(`${API_BASE_URL}/contests/bookmarked`);
  if (!response.ok) {
    throw new Error("Failed to fetch bookmarked contests");
  }
  const data = await response.json();
  return data.contests; 
}

export async function bookmarkContest(data: BookmarkRequest): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/contests/bookmark`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to bookmark contest");
  }
}

export async function addPCDLink(data: PCDLinkRequest): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/pcd`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to add PCD link");
  }
}