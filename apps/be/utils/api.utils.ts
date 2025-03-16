import axios from 'axios';
import type  { AxiosRequestConfig, AxiosResponse } from 'axios';

export class ApiClient {
  static async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.get(url, config);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(`API Error: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        throw new Error('No response received from server');
      } else {
        throw new Error(`Request failed: ${error.message}`);
      }
    }
  }
}

export interface ContestData {
  name: string;
  platform: string;
  startTime: Date;
  duration: number;
  url: string;
}