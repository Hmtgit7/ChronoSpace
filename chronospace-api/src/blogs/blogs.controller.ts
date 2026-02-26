import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CurrentUser,
  AuthUser,
} from '../common/decorators/current-user.decorator';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('blogs')
@UseGuards(JwtAuthGuard)
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  // --- Blog CRUD ---

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateBlogDto, @CurrentUser() user: AuthUser) {
    return this.blogsService.create(user.id, dto);
  }

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.blogsService.findAllByUser(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.blogsService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBlogDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.blogsService.update(id, user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.blogsService.remove(id, user.id);
  }

  // --- Like System ---

  @Post(':id/like')
  @HttpCode(HttpStatus.OK)
  likeBlog(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.blogsService.likeBlog(id, user.id);
  }

  @Delete(':id/like')
  @HttpCode(HttpStatus.OK)
  unlikeBlog(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.blogsService.unlikeBlog(id, user.id);
  }

  // --- Comment System ---

  @Post(':id/comments')
  @HttpCode(HttpStatus.CREATED)
  addComment(
    @Param('id') id: string,
    @Body() dto: CreateCommentDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.blogsService.addComment(id, user.id, dto.content);
  }

  @Get(':id/comments')
  @Throttle({ medium: { ttl: 60000, limit: 60 } })
  getComments(@Param('id') id: string) {
    return this.blogsService.getComments(id);
  }
}
