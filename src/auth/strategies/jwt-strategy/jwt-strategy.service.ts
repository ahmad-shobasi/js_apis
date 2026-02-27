import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UserRole } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from 'src/auth/auth.service';
import { RequestContext } from 'src/common/context/request-context';

@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('jwt.accessSecret'),
    });
  }

  async validate(payload: { sub: number; email: string; role: UserRole; sid: string }) {
    const store = RequestContext.getStore();
    const user = await this.authService.getUserById(payload.sub);

    if (user && !user.isVerified) throw new ForbiddenException('Email not verified');

    if (store) store.sessionId = payload.sid;

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
