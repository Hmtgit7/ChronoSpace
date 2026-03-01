import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Transform(({ value }) => value?.trim())
  displayName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Bio must not exceed 200 characters' })
  @Transform(({ value }) => value?.trim())
  bio?: string;
}
