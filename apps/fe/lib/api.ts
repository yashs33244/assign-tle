import type { BookmarkRequest, Contest, PCDLinkRequest, PastContest } from "@/types/contest"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

export async function fetchUpcomingContests() {
  const response = await fetch('http://localhost:4000/api/contests/upcoming');
  const data = await response.json();
  return data.contests; // Return just the contests array
}

export async function fetchPastContests(): Promise<PastContest[]> {
  const response = await fetch(`${API_BASE_URL}/contests/past`)
  if (!response.ok) {
    throw new Error("Failed to fetch past contests")
  }
  return response.json()
}

export async function bookmarkContest(data: BookmarkRequest): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/contests/bookmark`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to bookmark contest")
  }
}

export async function fetchPCDLinks(): Promise<Record<string, string>> {
  const response = await fetch(`${API_BASE_URL}/youtube/pcd`)
  if (!response.ok) {
    throw new Error("Failed to fetch PCD links")
  }
  return response.json()
}

export async function addPCDLink(data: PCDLinkRequest): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/admin/pcd`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to add PCD link")
  }
}

