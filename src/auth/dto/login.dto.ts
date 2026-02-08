import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({
    example: 'ah@host.domain',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '12345a',
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
