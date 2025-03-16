import type { Request, Response } from 'express';
import { PCDService } from '../services/pcd.service';
import { validationResult } from 'express-validator';

export class PCDController {
  static async getPCDForContest(req: Request, res: any) {
    try {
      const { contestId } = req.params;
      
      if (!contestId) {
        return res.status(400).json({
          message: 'Contest ID is required'
        });
      }
      
      const pcds = await PCDService.findPCDForContest(contestId);
      
      res.status(200).json({
        message: 'PCDs retrieved successfully',
        pcds
      });
    } catch (error: any) {
      if (error.message === 'Contest not found') {
        return res.status(404).json({
          message: error.message
        });
      }
      
      res.status(500).json({
        message: 'Failed to retrieve PCDs',
        error: error.message
      });
    }
  }
  
  static async addPCDManually(req: Request, res: any) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const { contestId, youtubeLink } = req.body;
      
      const pcd = await PCDService.addPCDManually(contestId, youtubeLink);
      
      res.status(201).json({
        message: 'PCD added successfully',
        pcd
      });
    } catch (error: any) {
      if (error.message === 'Contest not found') {
        return res.status(404).json({
          message: error.message
        });
      }
      
      res.status(500).json({
        message: 'Failed to add PCD',
        error: error.message
      });
    }
  }
  
  static async deletePCD(req: Request, res: any) {
    try {
      const { pcdId } = req.params;
      
      if (!pcdId) {
        return res.status(400).json({
          message: 'PCD ID is required'
        });
      }
      
      await PCDService.deletePCD(pcdId);
      
      res.status(200).json({
        message: 'PCD deleted successfully'
      });
    } catch (error: any) {
      if (error.message === 'PCD not found') {
        return res.status(404).json({
          message: error.message
        });
      }
      
      res.status(500).json({
        message: 'Failed to delete PCD',
        error: error.message
      });
    }
  }
}