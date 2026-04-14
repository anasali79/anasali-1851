import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateBrandDto {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  logoUrl?: string;
}
