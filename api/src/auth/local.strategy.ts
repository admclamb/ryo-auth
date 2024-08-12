import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { LoginAccountCommand } from 'src/account/commands/login-account/login-account.command';
import { Account } from 'src/db';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly commandBus: CommandBus) {
    super({
      usernameField: 'email',
    });
  }

  async validate(
    email: string,
    password: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    account: Account;
  }> {
    const accountWithToken = await this.commandBus.execute<
      LoginAccountCommand,
      {
        accessToken: string;
        refreshToken: string;
        account: Account;
      }
    >(
      new LoginAccountCommand({
        email,
        password,
      }),
    );

    if (!accountWithToken || !accountWithToken?.account) {
      throw new UnauthorizedException();
    }
    return accountWithToken;
  }
}
