import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpRequestDto } from './dto/sign-up.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import * as bcrypt from 'bcrypt';
import { TokensDto } from './dto/tokens.dto';
import { LoginRequestDto } from './dto/login.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly $context: DatabaseService,
    private readonly jwt: JwtService,
  ) {}

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
    const tokens: TokensDto = await this.generateTokens(user.id, user.email);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return {
      tokens: tokens,
      email: user.email,
      userName: user.name,
    };
  }

  async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    const user = this.$context.user.findUnique({
      where: { email: dto.email },
    });
    let foundUser;
    user.then((user) => {
      foundUser = user;
    });

    const passwordMatch = await bcrypt.compare(
      dto.password,
      foundUser.password,
    );
    if (!user || !passwordMatch)
      throw new UnauthorizedException('Invalid credentials');
    const tokens = await this.generateTokens(foundUser.id, foundUser.email);
    await this.saveRefreshToken(foundUser.id, tokens.refreshToken);

    return {
      tokens: tokens,
      email: foundUser.email,
      userName: foundUser.name,
    };
  }

  async refreshTokens(
    userId: number,
    refreshToken: string,
  ): Promise<LoginResponseDto> {
    const user = await this.$context.user.findUnique({
      where: { id: userId },
    });
    const tokenMatch = await bcrypt.compare(refreshToken, user?.refreshToken!);
    if (!user || !user.refreshToken || !tokenMatch)
      throw new UnauthorizedException('Invalid refresh token');
    const tokens = await this.generateTokens(user.id, user.email);
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return {
      tokens: tokens,
      email: user.email,
      userName: user.name,
    };
  }

  async logout(userId: number) {
    await this.$context.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  // ================== helpers ==================
  private async generateTokens(
    userId: number,
    email: string,
  ): Promise<TokensDto> {
    const payload = { sub: userId, email };

    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
    });

    const refreshToken = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
    });

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  private async saveRefreshToken(userId: number, refreshToken: string) {
    const hashed = await bcrypt.hash(refreshToken, 10);
    await this.$context.user.update({
      where: { id: userId },
      data: { refreshToken: hashed },
    });
  }
}
