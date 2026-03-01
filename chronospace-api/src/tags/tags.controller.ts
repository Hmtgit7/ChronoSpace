import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  // Public — anyone can read tags
  @Get()
  @Throttle({ medium: { ttl: 60000, limit: 60 } })
  getAllTags() {
    return this.tagsService.getAllTags();
  }

  // Protected — only logged-in users can create tags
  @Post()
  @UseGuards(JwtAuthGuard)
  @Throttle({ short: { ttl: 60000, limit: 10 } }) // max 10 new tags per minute
  createTag(@Body() dto: CreateTagDto) {
    return this.tagsService.createTag(dto);
  }
}
