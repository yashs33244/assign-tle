import {prismaClient as db} from 'db';   
import { CodeforcesService } from './codeforces.service';
import { CodeChefService } from './codechef.service';
import { LeetCodeService } from './leetcode.service';


export class ContestService {
  static async updateContests(): Promise<number> {
    try {
      // Fetch contests from all platforms
    //   const [codeforcesContests, codechefContests, leetcodeContests] = await Promise.all([
      const [codeforcesContests] = await Promise.all([
      CodeforcesService.fetchContests(),
        // CodeChefService.fetchContests(),
        // LeetCodeService.fetchContests()
      ]);
      
      const allContests = [
        ...codeforcesContests,
        // ...codechefContests,
        // ...leetcodeContests
      ];
      
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
          pcd: true
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
      return await db.contest.findMany({
        where: {
          isBookmarked: true
        },
        orderBy: {
          startTime: 'asc'
        }
      });
    } catch (error) {
      console.error('Error getting bookmarked contests:', error);
      throw error;
    }
  }
}