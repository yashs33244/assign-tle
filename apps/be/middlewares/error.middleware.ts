import type { Request, Response, NextFunction } from 'express';

export class ApiError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);
  
  // Handle API errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      message: err.message
    });
  }
  
  // Handle Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    return res.status(400).json({
      message: 'Database operation failed',
      error: err.message
    });
  }
  
  // Handle validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation failed',
      error: err.message
    });
  }
  
  // Default error handler
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message
  });
};