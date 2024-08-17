import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJwt,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: 'my-secret',
    });
  }

  async validate(payload: any) {
    console.log('PAYLOAD: ', payload);
    return { name: payload.name, id: payload.id };
  }

  private static extractJwt(req: Request): string | null {
    console.log('REQUEST: ', req.cookies, req?.cookies['rid']);
    if (
      req.cookies &&
      'rid' in req.cookies &&
      req.cookies.user_token.length > 0
    ) {
      return req.cookies.token;
    }
    return null;
  }
}
