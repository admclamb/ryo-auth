import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { LoginAccountCommand } from 'src/account/commands/login-account/login-account.command';
import { LoginAccountRequest } from 'src/account/dto/request/login-account-request.dto';
import { Account } from 'src/db';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly commandBus: CommandBus) {
    super();
  }

  async validate(loginAccountRequest: LoginAccountRequest): Promise<Account> {
    const user = await this.commandBus.execute<LoginAccountCommand, Account>(
      new LoginAccountCommand(loginAccountRequest),
    );

    console.log('USER: ', user);

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
