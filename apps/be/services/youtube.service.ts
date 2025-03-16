import { google, youtube_v3 } from 'googleapis';
import { ApiClient } from '../utils/api.utils';

export class YouTubeService {
  private static API_KEY = process.env.YOUTUBE_API_KEY;
  private static CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;
  
  static async searchPCDVideos(contestName: string) {
    try {
      const youtube = google.youtube({
        version: 'v3',
        auth: this.API_KEY
      });
      
      // Search for videos with contest name + "editorial" or "solution"
      const searchQuery = `${contestName} (editorial OR solution OR explanation)`;
      
      const response = await youtube.search.list({
        part: ['snippet'],
        q: searchQuery,
        type: ['video'],
        channelId: this.CHANNEL_ID,
        maxResults: 3,
        order: 'relevance'
      });
      
      if (!response.data.items || response.data.items.length === 0) {
        return [];
      }
      
      return response.data.items.map(item => ({
        videoId: item.id?.videoId,
        title: item.snippet?.title,
        url: `https://www.youtube.com/watch?v=${item.id?.videoId}`,
        publishedAt: item.snippet?.publishedAt
      }));
    } catch (error) {
      console.error('Error searching YouTube videos:', error);
      return [];
    }
  }
}