import { Injectable } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { CookieSerializeOptions } from '@fastify/cookie';

@Injectable()
export class CookieService {
  constructor(private readonly cookieConfig: CookieSerializeOptions) {}

  public addAuthCookies(
    response: FastifyReply,
    accessToken: string,
    refreshToken: string,
  ): void {
    response.cookie('id', accessToken, this.cookieConfig);
    response.cookie('rid', refreshToken, this.cookieConfig);
  }

  public clearAuthCookies(response: FastifyReply): void {
    response.clearCookie('id', this.cookieConfig);
    response.clearCookie('rid', this.cookieConfig);
  }
}
