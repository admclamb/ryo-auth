import { Injectable } from '@nestjs/common';
import { Bcrypt } from './bcrypt.types';

@Injectable()
export class PasswordManager {
  constructor(
    private readonly bcrypt: Bcrypt,
    private readonly salt: number,
  ) {}

  public async hash(password: string): Promise<string> {
    return await this.bcrypt.hash(password, this.salt);
  }

  public async isMatch(password: string, hash: string): Promise<boolean> {
    console.log(password, hash);
    return await this.bcrypt.compare(password, hash);
  }
}
