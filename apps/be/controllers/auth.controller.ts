import type { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { validationResult } from 'express-validator';

export class AuthController {
  static async register(req: Request, res: any) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const userData = {
        email: req.body.email,
        password: req.body.password
      };
      
      const user = await AuthService.registerUser(userData);
      
      res.status(201).json({
        message: 'User registered successfully',
        user
      });
    } catch (error: any) {
      if (error.message === 'User already exists') {
        return res.status(409).json({ message: error.message });
      }
      
      res.status(500).json({ message: 'Registration failed', error: error.message });
    }
  }
  
  static async login(req: Request, res: any) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const loginData = {
        email: req.body.email,
        password: req.body.password
      };
      
      const { token, user } = await AuthService.loginUser(loginData);
      
      res.status(200).json({
        message: 'Login successful',
        token,
        user
      });
    } catch (error: any) {
      if (error.message === 'Invalid credentials') {
        return res.status(401).json({ message: error.message });
      }
      
      res.status(500).json({ message: 'Login failed', error: error.message });
    }
  }
  
  static async getProfile(req: Request, res: any) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
      }
      
      res.status(200).json({
        user: {
          id: req.user.id,
          email: req.user.email,
          role: req.user.role
        }
      });
    } catch (error: any) {
      res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
    }
  }
  
}