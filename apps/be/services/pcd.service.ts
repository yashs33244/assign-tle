import { prismaClient as db } from 'db';
import { YouTubeService } from './youtube.service';

export class PCDService {
  static async findPCDForContest(contestId: string) {
    try {
      // Get contest details
      const contest = await db.contest.findUnique({
        where: { id: contestId }
      });
      
      if (!contest) {
        throw new Error('Contest not found');
      }
      
      // Check if we already have PCDs for this contest
      const existingPCDs = await db.pCD.findMany({
        where: { contestId }
      });
      
      if (existingPCDs.length > 0) {
        return existingPCDs;
      }
      
      // Otherwise search YouTube for PCDs
      const videos = await YouTubeService.searchPCDVideos(contest.name);
      
      // Store found videos as PCDs
      const pcds = [];
      
      for (const video of videos) {
        if (video.url) {
          const pcd = await db.pCD.create({
            data: {
              contestId: contest.id,
              youtubeLink: video.url,
              isAutoFetched: true
            }
          });
          pcds.push(pcd);
        }
      }
      
      return pcds;
    } catch (error) {
      console.error('Error finding PCD for contest:', error);
      throw error;
    }
  }
  static async findPCDForAll() {
    try {
 
      // Check if we already have PCDs for this contest
      const existingPCDs = await db.pCD.findMany();
      
      if (existingPCDs.length > 0) {
        return existingPCDs;
      }
      
      // Otherwise search YouTube for PCDs
    //   const videos = await YouTubeService.searchPCDVideos(contest.name);
      
    //   // Store found videos as PCDs
    //   const pcds = [];
      
    //   for (const video of videos) {
    //     if (video.url) {
    //       const pcd = await db.pCD.create({
    //         data: {
    //           contestId: contest.id,
    //           youtubeLink: video.url,
    //           isAutoFetched: true
    //         }
    //       });
    //       pcds.push(pcd);
    //     }
    //   }
      
    //   return pcds;
    } catch (error) {
      console.error('Error finding PCD for contest:', error);
      throw error;
    }
  }
  
  static async addPCDManually(contestId: string, youtubeLink: string) {
    try {
      // Validate contest exists
      const contest = await db.contest.findUnique({
        where: { id: contestId }
      });
      
      if (!contest) {
        throw new Error('Contest not found');
      }
      
      // Create PCD
      return await db.pCD.create({
        data: {
          contestId,
          youtubeLink,
          isAutoFetched: false
        }
      });
    } catch (error) {
      console.error('Error adding PCD manually:', error);
      throw error;
    }
  }
  
  static async deletePCD(pcdId: string) {
    try {
      const pcd = await db.pCD.findUnique({
        where: { id: pcdId }
      });
      
      if (!pcd) {
        throw new Error('PCD not found');
      }
      
      return await db.pCD.delete({
        where: { id: pcdId }
      });
    } catch (error) {
      console.error('Error deleting PCD:', error);
      throw error;
    }
  }
}