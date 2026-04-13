import { IsString, IsNotEmpty, IsOptional, MaxLength, IsUrl } from 'class-validator';

export class CreateBrandDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  logoUrl?: string;
}
