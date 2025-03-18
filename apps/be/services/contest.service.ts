import { prismaClient as db } from 'db';
import { ApiClient } from '../utils/api.utils';
import type { ContestData } from '../utils/api.utils';

interface CompeteApiContest {
  site: string;
  title: string;
  startTime: number;
  duration: number;
  endTime: number;
  url: string;
}

export class ContestService {
  private static COMPETE_API_URL = 'https://competeapi.vercel.app/contests/upcoming';
  
  private static mapPlatformName(site: string): string {
    // Map site names to platform names as they appear in your database
    const platformMap: Record<string, string> = {
      'codeforces': 'Codeforces',
      'codechef': 'CodeChef',
      'leetcode': 'LeetCode'
    };
    
    return platformMap[site] || site.charAt(0).toUpperCase() + site.slice(1);
  }
  
  static async fetchContests(): Promise<ContestData[]> {
    try {
      const response = await ApiClient.get<CompeteApiContest[]>(this.COMPETE_API_URL);
      
      return response.map(contest => ({
        name: contest.title,
        platform: this.mapPlatformName(contest.site),
        startTime: new Date(contest.startTime), // API returns in milliseconds
        duration: Math.floor(contest.duration / (60 * 1000)), // Convert from ms to minutes
        url: contest.url
      }));
    } catch (error) {
      console.error('Error fetching contests from CompeteAPI:', error);
      return [];
    }
  }
  
  static async updateContests(): Promise<number> {
    try {
      // Fetch contests from the new API
      const allContests = await this.fetchContests();
      
      let addedCount = 0;
      
      // Add each contest to database if it doesn't exist
      for (const contest of allContests) {
        const existingContest = await db.contest.findFirst({
          where: {
            name: contest.name,
            platform: contest.platform,
            startTime: contest.startTime
          }
        });
        
        if (!existingContest) {
          await db.contest.create({
            data: {
              name: contest.name,
              platform: contest.platform,
              startTime: contest.startTime,
              duration: contest.duration,
              url: contest.url,
              isBookmarked: false
            }
          });
          addedCount++;
        }
      }
      
      return addedCount;
    } catch (error) {
      console.error('Error updating contests:', error);
      throw error;
    }
  }
  
  static async getUpcomingContests(platformFilter?: string[]) {
    try {
      const now = new Date();
      
      const whereClause = {
        startTime: {
          gte: now
        },
        ...(platformFilter && platformFilter.length > 0 ? {
          platform: {
            in: platformFilter
          }
        } : {})
      };
      
      return await db.contest.findMany({
        where: whereClause,
        orderBy: {
          startTime: 'asc'
        }
      });
    } catch (error) {
      console.error('Error getting upcoming contests:', error);
      throw error;
    }
  }
  
  static async getPastContests(platformFilter?: string[]) {
    try {
      const now = new Date();
      
      const whereClause = {
        startTime: {
          lt: now
        },
        ...(platformFilter && platformFilter.length > 0 ? {
          platform: {
            in: platformFilter
          }
        } : {})
      };
      
      return await db.contest.findMany({
        where: whereClause,
        orderBy: {
          startTime: 'desc'
        },
        include: {
          pcd: true // Include related PCD records
        }
      });
    } catch (error) {
      console.error('Error getting past contests:', error);
      throw error;
    }
  }
  
  static async toggleBookmark(contestId: string) {
    try {
      const contest = await db.contest.findUnique({
        where: { id: contestId }
      });
      
      if (!contest) {
        throw new Error('Contest not found');
      }
      
      return await db.contest.update({
        where: { id: contestId },
        data: { isBookmarked: !contest.isBookmarked }
      });
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      throw error;
    }
  }
  static async getBookmarkedContests() {
    try {
      const whereClause = {
        isBookmarked: true
      };
  
      const res = await db.contest.findMany({
        where: whereClause,
        orderBy: {
          startTime: 'asc'
        }
        // No `select` means all columns will be returned
      });
  
      return res;
    } catch (error) {
      console.error('Error getting bookmarked contests:', error);
      throw error;
    }
  }
  
}