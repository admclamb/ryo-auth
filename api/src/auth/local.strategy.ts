import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { LoginAccountCommand } from 'src/account/commands/login-account/login-account.command';
import { Account } from 'src/db';
import { LoginAccountRequest } from 'src/account/dto/request/login-account-request.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {
    super();
  }

  async validate(loginAccountRequest: LoginAccountRequest): Promise<any> {
    const user = await this.commandBus.execute<LoginAccountCommand, Account>(
      new LoginAccountCommand(loginAccountRequest);
    )
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
