import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { AuthModule } from '../auth/auth.module';
import { QUEUES } from '../common/constants/queue.constants';

@Module({
  imports: [AuthModule, BullModule.registerQueue({ name: QUEUES.BLOG })],
  controllers: [BlogsController],
  providers: [BlogsService],
})
export class BlogsModule {}
