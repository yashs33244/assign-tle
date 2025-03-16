import { ApiClient} from '../utils/api.utils';
import type { ContestData } from '../utils/api.utils';

interface CodeforcesContest {
  id: number;
  name: string;
  type: string;
  phase: string;
  durationSeconds: number;
  startTimeSeconds: number;
  relativeTimeSeconds: number;
}

interface CodeforcesResponse {
  status: string;
  result: CodeforcesContest[];
}

export class CodeforcesService {
  private static API_URL = 'https://codeforces.com/api/contest.list';
  
  static async fetchContests(): Promise<ContestData[]> {
    try {
      const response = await ApiClient.get<CodeforcesResponse>(this.API_URL);
      
      if (response.status !== 'OK') {
        throw new Error('Failed to fetch Codeforces contests');
      }
      
      // Filter for upcoming and ongoing contests
      const relevantContests = response.result.filter(
        contest => contest.phase === 'BEFORE' || contest.phase === 'CODING'
      );
      
      return relevantContests.map(contest => ({
        name: contest.name,
        platform: 'Codeforces',
        startTime: new Date(contest.startTimeSeconds * 1000),
        duration: Math.floor(contest.durationSeconds / 60), // Convert to minutes
        url: `https://codeforces.com/contest/${contest.id}`
      }));
    } catch (error) {
      console.error('Error fetching Codeforces contests:', error);
      return [];
    }
  }
}