import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateAccountRequest } from './dto/request/create-account-request.dto';
import { Account } from 'src/db';
import { CreateAccountCommand } from './commands/create-account/create-account.command';
import { PasswordManager } from 'src/common/password/password-manager';

@Controller('v1/account')
export class AccountController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly passwordManager: PasswordManager,
  ) {}

  @Post()
  async createAccount(
    @Body() createAccountRequest: CreateAccountRequest,
  ): Promise<Account> {
    createAccountRequest.password = await this.passwordManager.hash(
      createAccountRequest.password,
    );

    return this.commandBus.execute<CreateAccountCommand, Account>(
      new CreateAccountCommand(createAccountRequest),
    );
  }
}
