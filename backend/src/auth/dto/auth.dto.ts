import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({ example: 'contact@growagency.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'securepassword123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'Grow Digital Agency' })
  @IsString()
  agencyName: string;
}

export class LoginDto {
  @ApiProperty({ example: 'contact@growagency.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'securepassword123' })
  @IsString()
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  refreshToken: string;
}
