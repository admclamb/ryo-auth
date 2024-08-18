import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { LoginAccountCommand } from './login-account.command';
import { Account, Identity } from 'src/db';
import { PasswordManager } from 'src/common/password/password-manager';
import { AccountRepository } from 'src/account/repositories';
import { NotFoundException } from '@nestjs/common';
import { LoginAccountRequest } from 'src/account/dto/request/login-account-request.dto';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@CommandHandler(LoginAccountCommand)
export class LoginAccountHandler
  implements ICommandHandler<LoginAccountCommand>
{
  constructor(
    private readonly eventPublisher: EventPublisher,
    private readonly accountRepository: AccountRepository,
    private readonly passwordManager: PasswordManager,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute({ loginAccountRequest }: LoginAccountCommand): Promise<{
    accessToken: string;
    refreshToken: string;
    account: Account;
  }> {
    const account = this.eventPublisher.mergeObjectContext(
      await this.login(loginAccountRequest),
    );

    return {
      account,
      accessToken: this.createToken(account, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '30d',
      }),
      refreshToken: this.createToken(account, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '15min',
      }),
    };
  }

  private async login(
    loginAccountRequest: LoginAccountRequest,
  ): Promise<Account> {
    const account = await this.accountRepository.findByEmail(
      loginAccountRequest.email,
      ['identities', 'identities.connection'],
    );

    if (!Array.isArray(account?.identities)) {
      throw new NotFoundException('Email not found or password is invalid');
    }

    const isPasswordMatching = await this.isMatchingPassword(
      account,
      loginAccountRequest.password,
    );

    if (!isPasswordMatching) {
      throw new NotFoundException('Email not found or password is invalid');
    }

    return account;
  }

  private createToken(
    account: Account,
    signOptions: JwtSignOptions = {},
  ): string {
    const payload = {
      username: account.name,
      sub: account.id,
    };

    return this.jwtService.sign(payload, signOptions);
  }

  private findIdentityForPassword(account: Account): Identity {
    return account?.identities.find(
      (identity) =>
        identity.connection.connectionType ===
        'Username-Password-Authentication',
    );
  }

  private isMatchingPassword(
    account: Account,
    password: string,
  ): Promise<boolean> {
    const identity = this.findIdentityForPassword(account);

    return this.passwordManager.isMatch(password, identity.password);
  }
}
