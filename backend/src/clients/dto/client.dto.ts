import { IsString, IsEmail, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty({ example: 'Bright Digital Co.' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'hello@brightdigital.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: 'https://brightdigital.com' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ example: 'Europe/London' })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({ example: 'Monthly SEO + Google Ads reporting' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateClientDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
