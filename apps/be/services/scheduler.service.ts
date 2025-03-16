import cron from 'node-cron';
import { ContestService } from './contest.service';

export class SchedulerService {
  public static contestUpdateJob: cron.ScheduledTask;
  
  static async updateContests() {
    try {
      console.log('Running scheduled contest update job');
      const addedCount = await ContestService.updateContests();
      console.log(`Contest update complete. Added ${addedCount} new contests.`);
    } catch (error) {
      console.error('Error in scheduled contest update:', error);
    }
  }
}

export function setupScheduler() {
  // Schedule contest update job (every 6 hours by default)
  const cronExpression = process.env.CONTEST_UPDATE_CRON || '0 */6 * * *';
  
  // Validate cron expression
  if (!cron.validate(cronExpression)) {
    console.error(`Invalid cron expression: ${cronExpression}`);
    return;
  }
  
  // Schedule job
  SchedulerService.contestUpdateJob = cron.schedule(cronExpression, () => {
    SchedulerService.updateContests();
  });
  
  console.log(`Scheduled contests update job with cron: ${cronExpression}`);
  
  // Run once on startup
  SchedulerService.updateContests();
}