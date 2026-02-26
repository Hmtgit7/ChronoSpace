import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BlogProcessor } from './processors/blog.processor';
import { QUEUES } from '../common/constants/queue.constants';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUES.BLOG,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: 50, // keep last 50 completed jobs for debugging
        removeOnFail: 100, // keep last 100 failed jobs for inspection
      },
    }),
  ],
  providers: [BlogProcessor],
  exports: [
    BullModule, // export so BlogsModule can inject the queue
  ],
})
export class JobsModule {}
