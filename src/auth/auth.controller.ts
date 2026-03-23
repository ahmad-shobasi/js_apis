import {
  Controller,
  Post,
  Body,
  Param,
  ValidationPipe,
  ParseIntPipe,
  Get,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpRequestDto } from './dto/sign-up.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginRequestDto } from './dto/login.dto';
import { ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from './strategies/jwt-auth/jwt-auth.guard';
import { RefreshAuthGuard } from './strategies/refresh-auth/refresh-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserRoles } from 'src/common/decorators/user-role.decorator';
import { UserRoleGuard } from './strategies/user-role/user-role.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async getUsers() {
    return await this.authService.getUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getUserByEmail(@Req() req) {
    return req.user;
  }

  @Post('signup')
  @ApiBody({ type: SignUpRequestDto })
  async signUp(@Body(ValidationPipe) dto: SignUpRequestDto) {
    return await this.authService.signUp(dto);
  }

  @Post('login')
  @ApiBody({ type: LoginRequestDto })
  async login(@Body(ValidationPipe) dto: LoginRequestDto): Promise<LoginResponseDto> {
    return await this.authService.login(dto);
  }

  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refreshToken(@CurrentUser() user): Promise<LoginResponseDto> {
    return await this.authService.refreshTokens(user.id);
  }

  @Get('verify-account')
  async verifyAccount(@Query('token') token: string) {
    await this.authService.verifyAccount(token);
    return { message: 'Account verified successfully.' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@CurrentUser() user) {
    await this.authService.logout(user.id);
  }

  @Post('delete-users')
  async deleteAllUsers() {
    await this.authService.deleteAllUsers();
  }

  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @UserRoles('ADMIN')
  @Post('delete-user/:id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    await this.authService.deleteUser(id);
  }
}
