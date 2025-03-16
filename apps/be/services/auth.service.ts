import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prismaClient as db } from 'db';

export interface RegisterUserData {
  email: string;
  password: string;
}

export interface LoginUserData {
  email: string;
  password: string;
}

export class AuthService {
  static async registerUser(userData: RegisterUserData) {
    const { email, password } = userData;
    
    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'user', // Default role
      }
    });
    
    return {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role
    };
  }
  
  static async loginUser(loginData: LoginUserData) {
    const { email, password } = loginData;
    
    // Find user
    const user = await db.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || '',
      { expiresIn: '24h' }
    );
    
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    };
  }
}