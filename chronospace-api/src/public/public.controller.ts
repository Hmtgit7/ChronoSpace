import { Controller, Get, Param, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { PublicService } from './public.service';
import { FeedQueryDto } from './dto/feed-query.dto';

@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('feed')
  @Throttle({ medium: { ttl: 60000, limit: 60 } })
  getFeed(@Query() query: FeedQueryDto) {
    return this.publicService.getFeed(query);
  }

  @Get('tags')
  @Throttle({ medium: { ttl: 60000, limit: 60 } })
  getAllTags() {
    return this.publicService.getAllTags();
  }

  @Get('blogs/:slug')
  @Throttle({ medium: { ttl: 60000, limit: 60 } })
  getBlogBySlug(@Param('slug') slug: string) {
    return this.publicService.getBlogBySlug(slug);
  }
}
