import {
  Body,
  Controller,
  NotFoundException,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateAccountRequest } from './dto/request/create-account-request.dto';
import { Account } from 'src/db';
import { CreateAccountCommand } from './commands/create-account/create-account.command';
import { AccountFactory } from './factories';
import { AccountDto } from './dto/account.dto';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { FastifyReply } from 'fastify';
import { CookieService } from 'src/auth/cookie.service';

@Controller('v1/account')
export class AccountController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly accountFactory: AccountFactory,
    private readonly cookieService: CookieService,
  ) {}

  @Post()
  async createAccount(
    @Body() createAccountRequest: CreateAccountRequest,
    @Res({ passthrough: true }) response: FastifyReply,
  ): Promise<AccountDto> {
    const accountWithToken = await this.commandBus.execute<
      CreateAccountCommand,
      {
        account: Account;
        accessToken: string;
        refreshToken: string;
      }
    >(new CreateAccountCommand(createAccountRequest));

    const account = this.accountFactory.createDto(accountWithToken.account);

    this.cookieService.addAuthCookies(
      response,
      accountWithToken.accessToken,
      accountWithToken.refreshToken,
    );

    return account;
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
