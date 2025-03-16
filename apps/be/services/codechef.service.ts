import { ApiClient } from '../utils/api.utils';
import type { ContestData } from '../utils/api.utils'; 

interface CodeChefContest {
  code: string;
  name: string;
  start_date: string;
  end_date: string;
  url: string;
}

export class CodeChefService {
  private static API_URL = 'https://www.codechef.com/api/list/contests/all';
  
  static async fetchContests(): Promise<ContestData[]> {
    try {
      const response = await ApiClient.get<{
        present: CodeChefContest[];
        future: CodeChefContest[];
      }>(this.API_URL);
      
      // Combine present and future contests
      const allContests = [...response.present, ...response.future];
      
      return allContests.map(contest => {
        const startTime = new Date(contest.start_date);
        const endTime = new Date(contest.end_date);
        const durationMinutes = Math.floor((endTime.getTime() - startTime.getTime()) / (60 * 1000));
        
        return {
          name: contest.name,
          platform: 'CodeChef',
          startTime,
          duration: durationMinutes,
          url: `https://www.codechef.com/${contest.code}`
        };
      });
    } catch (error) {
      console.error('Error fetching CodeChef contests:', error);
      return [];
    }
  }
}