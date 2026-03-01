import { IsArray, IsString, ArrayMaxSize } from 'class-validator';

export class UpdateBlogTagsDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(5, { message: 'A blog can have at most 5 tags' })
  tagIds: string[];
}
