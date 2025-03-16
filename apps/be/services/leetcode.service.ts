import { ApiClient } from '../utils/api.utils';
import type { ContestData } from '../utils/api.utils';

interface LeetCodeContest {
  id: number;
  title: string;
  startTime: number;
  duration: number;
  titleSlug: string;
}

interface LeetCodeResponse {
  allContests: {
    edges: Array<{ node: LeetCodeContest }>;
  };
}

export class LeetCodeService {
  private static API_URL = 'https://leetcode.com/graphql';
  
  static async fetchContests(): Promise<ContestData[]> {
    try {
      const query = `
        query {
          allContests {
            edges {
              node {
                id
                title
                startTime
                duration
                titleSlug
              }
            }
          }
        }
      `;
      
      const response = await ApiClient.get<LeetCodeResponse>(
        this.API_URL, 
        { 
          params: { query },
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      const now = Date.now() / 1000; // Current time in seconds
      
      // Filter for upcoming contests
      const upcomingContests = response.allContests.edges
        .map(edge => edge.node)
        .filter(contest => contest.startTime > now);
      
      return upcomingContests.map(contest => ({
        name: contest.title,
        platform: 'LeetCode',
        startTime: new Date(contest.startTime * 1000),
        duration: contest.duration, // Already in minutes
        url: `https://leetcode.com/contest/${contest.titleSlug}`
      }));
    } catch (error) {
      console.error('Error fetching LeetCode contests:', error);
      return [];
    }
  }
}