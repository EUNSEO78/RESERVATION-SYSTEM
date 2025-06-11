import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.['refreshToken'],
      ]),
      secretOrKey: process.env.JWT_REFRESH_SECRET || 'refreshSecretKey',
      passReqToCallback: false, // 요청 객체를 콜백에 전달하지 않음
      ignoreExpiration: false, // 만료된 토큰을 무시하지 않음
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
