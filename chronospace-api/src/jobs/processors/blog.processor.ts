import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../../prisma/prisma.service';
import { QUEUES, BLOG_JOBS } from '../../common/constants/queue.constants';
import type { GenerateSummaryJobData } from '../types/blog-job.types';

@Processor(QUEUES.BLOG)
export class BlogProcessor extends WorkerHost {
  private readonly logger = new Logger(BlogProcessor.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<GenerateSummaryJobData>): Promise<void> {
    if (job.name === BLOG_JOBS.GENERATE_SUMMARY) {
      await this.handleGenerateSummary(job);
    }
  }

  private async handleGenerateSummary(
    job: Job<GenerateSummaryJobData>,
  ): Promise<void> {
    const { blogId, content } = job.data;

    this.logger.log(`[Job ${job.id}] Generating summary for blog: ${blogId}`);

    // Strip markdown/HTML, take first 300 chars, trim to last full word
    const plainText = content
      .replace(/#{1,6}\s+/g, '') // remove markdown headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // remove bold
      .replace(/\*(.*?)\*/g, '$1') // remove italic
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // remove links
      .replace(/`{1,3}[^`]*`{1,3}/g, '') // remove code blocks
      .replace(/\n+/g, ' ')
      .trim();

    const maxLength = 300;
    let summary = plainText.slice(0, maxLength);

    // Trim to last complete word
    if (plainText.length > maxLength) {
      const lastSpace = summary.lastIndexOf(' ');
      summary =
        lastSpace > 0 ? summary.slice(0, lastSpace) + '...' : summary + '...';
    }

    await this.prisma.blog.update({
      where: { id: blogId },
      data: { summary },
    });

    this.logger.log(
      `[Job ${job.id}] Summary stored for blog: ${blogId} (${summary.length} chars)`,
    );
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job): void {
    this.logger.log(
      `[Job ${job.id}] "${job.name}" completed in ${job.processedOn! - job.timestamp}ms`,
    );
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error): void {
    this.logger.error(
      `[Job ${job.id}] "${job.name}" failed after ${job.attemptsMade} attempts: ${error.message}`,
    );
  }

  @OnWorkerEvent('active')
  onActive(job: Job): void {
    this.logger.debug(`[Job ${job.id}] "${job.name}" started processing`);
  }
}
