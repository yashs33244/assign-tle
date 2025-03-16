import type { Request, Response } from 'express';
import {prismaClient as db} from 'db';
import { ContestService } from '../services/contest.service';

export class AdminController {
  static async getAllUsers(req: Request, res: Response) {
    try {
      const users = await db.user.findMany({
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true
        }
      });
      
      res.status(200).json({
        message: 'Users retrieved successfully',
        users
      });
    } catch (error: any) {
      res.status(500).json({
        message: 'Failed to retrieve users',
        error: error.message
      });
    }
  }
  
  static async updateUserRole(req: Request, res: any) {
    try {
      const { userId, role } = req.body;
      
      if (!userId || !role) {
        return res.status(400).json({
          message: 'User ID and role are required'
        });
      }
      
      // Check if role is valid
      if (role !== 'user' && role !== 'admin') {
        return res.status(400).json({
          message: 'Invalid role. Must be "user" or "admin".'
        });
      }
      
      // Check if user exists
      const user = await db.user.findUnique({
        where: { id: userId }
      });
      
      if (!user) {
        return res.status(404).json({
          message: 'User not found'
        });
      }
      
      // Update user role
      const updatedUser = await db.user.update({
        where: { id: userId },
        data: { role },
        select: {
          id: true,
          email: true,
          role: true
        }
      });
      
      res.status(200).json({
        message: 'User role updated successfully',
        user: updatedUser
      });
    } catch (error: any) {
      res.status(500).json({
        message: 'Failed to update user role',
        error: error.message
      });
    }
  }
  
  static async triggerContestUpdate(req: Request, res: Response) {
    try {
      const addedCount = await ContestService.updateContests();
      
      res.status(200).json({
        message: 'Contest update triggered successfully',
        addedContests: addedCount
      });
    } catch (error: any) {
      res.status(500).json({
        message: 'Failed to trigger contest update',
        error: error.message
      });
    }
  }
}