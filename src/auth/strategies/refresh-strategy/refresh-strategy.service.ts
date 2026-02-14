import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from 'src/auth/auth.service';
import { RequestContext } from 'src/common/context/request-context';

@Injectable()
export class RefreshStrategyService extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private authService: AuthService,
    private config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('jwt.refreshSecret'),
      passReqToCallback: true,
    });
  }
  async validate(reg: Request, payload: { sub: number; jti: string }) {
    const user = await this.authService.getUserById(payload.sub);
    const store = RequestContext.getStore();

    if (!user || user.refreshTokenId !== payload.jti) throw new UnauthorizedException('Invalid refresh token');

    if (store) {
      // store.userId = user.id;
      store.sessionId = payload.jti;
    }

    return { id: user.id };
  }
}
