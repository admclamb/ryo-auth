import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class CookieService {
  constructor(private readonly cookieConfig) {}

  public addAuthCookies(
    response: Response,
    accessToken: string,
    refreshToken: string,
  ): void {
    response.cookie('id', accessToken, this.cookieConfig);
    response.cookie('rid', refreshToken, this.cookieConfig);
  }

  public clearAuthCookies(response: Response): void {
    response.clearCookie('id', this.cookieConfig);
    response.clearCookie('rid', this.cookieConfig);
  }
}
