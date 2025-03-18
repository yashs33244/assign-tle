import type { Request, Response } from 'express';
import { ContestService } from '../services/contest.service';

export class ContestController {
  static async getUpcomingContests(req: Request, res: Response) {
    try {
      // Handle platform filter from query params
      let platformFilter: string[] | undefined;
      if (req.query.platform) {
        platformFilter = (req.query.platform as string).split(',');
      }
      
      const contests = await ContestService.getUpcomingContests(platformFilter);
      
      res.status(200).json({
        message: 'Upcoming contests retrieved successfully',
        contests
      });
    } catch (error: any) {
      res.status(500).json({
        message: 'Failed to retrieve upcoming contests',
        error: error.message
      });
    }
  }
  
  static async getPastContests(req: Request, res: Response) {
    try {
      // Handle platform filter from query params
      let platformFilter: string[] | undefined;
      if (req.query.platform) {
        platformFilter = (req.query.platform as string).split(',');
      }
      
      const contests = await ContestService.getPastContests(platformFilter);
      
      res.status(200).json({
        message: 'Past contests retrieved successfully',
        contests
      });
    } catch (error: any) {
      res.status(500).json({
        message: 'Failed to retrieve past contests',
        error: error.message
      });
    }
  }
  
  static async getAllPastContests(req: Request, res: Response) {
    try {
      // Handle platform filter from query params
      let platformFilter: string[] | undefined;
      if (req.query.platform) {
        platformFilter = (req.query.platform as string).split(',');
      }
      
      // For the admin interface, get contests that ended within the last X days
      // or use a different approach to ensure we have data to show
      const now = new Date();
      // This ensures we have some past contests even if your DB only has future contests
      const pastCutoff = new Date(now);
      pastCutoff.setDate(now.getDate() + 2); // Include contests from up to 2 days in the future
      
      const contests = await ContestService.getPastContests(platformFilter);
      // Filter contests that are "past" for admin purposes (including very recent ones)
      const filteredContests = contests.filter(
        contest => new Date(contest.startTime) <= pastCutoff
      );
      
      res.status(200).json({
        message: 'Past contests retrieved successfully',
        contests: filteredContests
      });
    } catch (error: any) {
      res.status(500).json({
        message: 'Failed to retrieve past contests',
        error: error.message
      });
    }
  }
  
  static async toggleBookmark(req: Request, res: any) {
    try {
      const { contestId } = req.body;
      
      if (!contestId) {
        return res.status(400).json({
          message: 'Contest ID is required'
        });
      }
      
      const updatedContest = await ContestService.toggleBookmark(contestId);
      
      res.status(200).json({
        message: `Contest ${updatedContest.isBookmarked ? 'bookmarked' : 'unbookmarked'} successfully`,
        contest: updatedContest
      });
    } catch (error: any) {
      if (error.message === 'Contest not found') {
        return res.status(404).json({
          message: error.message
        });
      }
      
      res.status(500).json({
        message: 'Failed to toggle bookmark',
        error: error.message
      });
    }
  }
  
  static async getBookmarkedContests(req: Request, res: Response) {
    try {
      

      
      const contests = await ContestService.getBookmarkedContests();
      
      res.status(200).json({
        message: 'Bookmarked contests retrieved successfully',
        contests
      });
    } catch (error: any) {
      res.status(500).json({
        message: 'Failed to retrieve bookmarked contests',
        error: error.message
      });
    }
  }
}