import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpRequestDto } from './dto/sign-up.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import * as bcrypt from 'bcrypt';
import { TokensDto } from './dto/tokens.dto';
import { LoginRequestDto } from './dto/login.dto';
import { User, UserRole } from '@prisma/client';
import { v4 as uuid_v4 } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly $context: DatabaseService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async getUsers() {
    return await this.$context.user.findMany();
  }

  // Signup function
  async signUp(dto: SignUpRequestDto): Promise<LoginResponseDto> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.$context.user.create({
      data: {
        name: dto.userName,
        email: dto.email,
        role: dto.role,
        password: hashedPassword,
      },
    });
    const tokens: TokensDto = await this.getTokens(user.id, user.email, user.role);

    return {
      tokens: tokens,
      email: user.email,
      userName: user.name,
    };
  }

  // Login function
  async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.getUserByEmail(dto.email);

    if (!user) throw new BadRequestException('no user with givin email');

    const passwordMatch = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatch) throw new UnauthorizedException('Invalid password');

    const tokens = await this.getTokens(user.id, user.email, user.role);
    return {
      tokens: tokens,
      email: user.email,
      userName: user.name,
    };
  }

  // Refresh Tokens function
  async refreshTokens(userId: number): Promise<LoginResponseDto> {
    const user = await this.getUserById(userId);

    if (!user) throw new NotFoundException();

    const tokens = await this.getTokens(user.id, user.email, user.role);

    return {
      tokens: tokens,
      email: user.email,
      userName: user.name,
    };
  }

  // Logout function
  async logout(userId: number) {
    await this.$context.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshTokenId: null,
      },
    });
  }

  async deleteUser(id: number) {
    const user = await this.$context.user.delete({
      where: {
        id,
      },
    });
    if (!user) throw new NotFoundException();
  }
  async deleteAllUsers() {
    await this.$context.user.deleteMany();
  }

  // ================== helpers ==================

  private async getTokens(userId: number, email: string, role: UserRole) {
    const refreshTokenId = uuid_v4();

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(
        { sub: userId, email, role, sid: refreshTokenId },
        { secret: this.config.get<string>('JWT_SECRET'), expiresIn: '15m' },
      ),
      this.jwt.signAsync(
        { sub: userId, jti: refreshTokenId },
        { secret: this.config.get<string>('JWT_REFRESH_SECRET'), expiresIn: '7d' },
      ),
    ]);

    // Update the generated refresh Id so the context will create new session.
    await this.$context.user.update({
      where: { id: userId },
      data: { refreshTokenId },
    });

    return { accessToken, refreshToken };
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.$context.user.findUnique({
      where: { email },
    });
    return user;
  }

  async getUserById(id: number): Promise<User | null> {
    const user = await this.$context.user.findUnique({
      where: { id },
    });
    return user;
  }
}
