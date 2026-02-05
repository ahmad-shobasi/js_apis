import {
  Controller,
  Post,
  Body,
  Param,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpRequestDto } from './dto/sign-up.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginRequestDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(
    @Body(ValidationPipe) dto: SignUpRequestDto,
  ): Promise<LoginResponseDto> {
    return await this.authService.signUp(dto);
  }

  @Post('login')
  async login(
    @Body(ValidationPipe) dto: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    return await this.authService.login(dto);
  }

  @Post('refresh')
  async refreshToken(
    @Param(ParseIntPipe) userId: number,
    @Param() refreshToken: string,
  ): Promise<LoginResponseDto> {
    return await this.authService.refreshTokens(userId, refreshToken);
  }

  @Post('logout')
  async logout(@Param(ParseIntPipe) userId: number) {
    await this.authService.logout(userId);
  }
}
