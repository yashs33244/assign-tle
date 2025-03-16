import type { BookmarkRequest, Contest, PCDLinkRequest, PastContest } from "@/types/contest"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

export async function fetchUpcomingContests(): Promise<Contest[]> {
  const response = await fetch(`${API_BASE_URL}/contests/upcoming`)
  if (!response.ok) {
    throw new Error("Failed to fetch upcoming contests")
  }
  return response.json()
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

