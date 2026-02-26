import {
  IsString,
  IsBoolean,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdateBlogDto {
  @IsString()
  @IsOptional()
  @MinLength(3, { message: 'Title must be at least 3 characters' })
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  title?: string;

  @IsString()
  @IsOptional()
  @MinLength(10, { message: 'Content must be at least 10 characters' })
  content?: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
