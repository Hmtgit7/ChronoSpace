import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty({ message: 'Comment content is required' })
  @MinLength(1)
  @MaxLength(1000, { message: 'Comment must not exceed 1000 characters' })
  content: string;
}
