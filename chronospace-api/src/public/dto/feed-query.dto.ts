import { IsOptional, IsInt, Min, Max, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export type FeedSort = 'latest' | 'trending';

export class FeedQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 9;

  @IsOptional()
  @IsString()
  @IsIn(['latest', 'trending'])
  sort?: FeedSort = 'latest';

  @IsOptional()
  @IsString()
  tag?: string; // tag name slug e.g. "technology"
}
