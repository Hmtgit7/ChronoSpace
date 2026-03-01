import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTagDto {
  @IsString()
  @MinLength(2, { message: 'Tag must be at least 2 characters' })
  @MaxLength(30, { message: 'Tag must not exceed 30 characters' })
  @Matches(/^[a-zA-Z0-9\s-]+$/, {
    message: 'Tag can only contain letters, numbers, spaces and hyphens',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  label: string;

  @IsString()
  @IsOptional()
  color?: string;
}
