import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from 'src/auth/auth.service';
import { JWT_REFRESH_SECRET } from 'src/jwt.secret';

@Injectable()
export class RefreshStrategyService extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }
  async validate(reg: Request, payload: { sub: number; jti: string }) {
    const user = await this.authService.getUserById(payload.sub);

    if (!user || user.refreshTokenId !== payload.jti) throw new UnauthorizedException('Invalid refresh token');

    return { id: user.id };
  }
}
