import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignUpRequestDto {
  // UserName
  @ApiProperty({
    example: 'userName',
  })
  @IsString()
  @IsNotEmpty()
  userName: string;

  // Email
  @ApiProperty({
    example: 'user@host.domain',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  // Role
  @ApiProperty({
    example: 'GUEST',
  })
  @IsString()
  @IsEnum(UserRole, {
    message: 'valid role required',
  })
  role: UserRole;

  // Password
  @ApiProperty({
    example: 'should exist',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
