import {
  Body,
  Controller,
  Get,
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
import { CookieService } from 'src/auth/cookie.service';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

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
    @Res({ passthrough: true }) response: Response,
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
  signIn(
    @Req() req,
    @Res({ passthrough: true }) response: Response,
  ): AccountDto {
    if (!req?.user || !req?.user.account) {
      throw new NotFoundException('Error');
    }

    const account = this.accountFactory.createDto(req?.user.account);

    this.cookieService.addAuthCookies(
      response,
      req?.user.accessToken,
      req?.user.refreshToken,
    );

    return account;
  }

  @UseGuards(JwtAuthGuard)
  @Get('access-token')
  async getAccessToken(@Req() req) {
    console.log(req);
    return null;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    const account = this.accountFactory.createDto(req?.user.account);

    return account;
  }
}
