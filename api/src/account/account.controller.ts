import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateAccountRequest } from './dto/request/create-account-request.dto';
import { Account } from 'src/db';
import { CreateAccountCommand } from './commands/create-account/create-account.command';

@Controller('v1/account')
export class AccountController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  createAccount(
    @Body() createAccountRequest: CreateAccountRequest,
  ): Promise<Account> {
    return this.commandBus.execute<CreateAccountCommand, Account>(
      new CreateAccountCommand(createAccountRequest),
    );
  }
}
