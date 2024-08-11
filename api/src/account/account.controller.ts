import {
  Body,
  Controller,
  NotFoundException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateAccountRequest } from './dto/request/create-account-request.dto';
import { Account } from 'src/db';
import { CreateAccountCommand } from './commands/create-account/create-account.command';
import { AccountFactory } from './factories';
import { AccountDto } from './dto/account.dto';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { Token } from 'src/auth/token';

@Controller('v1/account')
export class AccountController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly accountFactory: AccountFactory,
  ) {}

  @Post()
  createAccount(
    @Body() createAccountRequest: CreateAccountRequest,
  ): Promise<Token> {
    return this.commandBus.execute<CreateAccountCommand, Token>(
      new CreateAccountCommand(createAccountRequest),
    );
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  signIn(@Req() req): AccountDto {
    if (!req.user) {
      throw new NotFoundException();
    }
    return this.accountFactory.createDto(req.user);
  }
}
