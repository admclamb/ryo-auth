import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { LoginAccountCommand } from './login-account.command';
import { Account, Identity } from 'src/db';
import { PasswordManager } from 'src/common/password/password-manager';
import { AccountRepository } from 'src/account/repositories';
import { NotFoundException } from '@nestjs/common';
import { LoginAccountRequest } from 'src/account/dto/request/login-account-request.dto';

@CommandHandler(LoginAccountCommand)
export class LoginAccountHandler
  implements ICommandHandler<LoginAccountCommand>
{
  constructor(
    private readonly eventPublisher: EventPublisher,
    private readonly accountRepository: AccountRepository,
    private readonly passwordManager: PasswordManager,
  ) {}

  async execute({
    loginAccountRequest,
  }: LoginAccountCommand): Promise<Account> {
    loginAccountRequest.password = await this.passwordManager.hash(
      loginAccountRequest.password,
    );

    const account = this.eventPublisher.mergeObjectContext(
      await this.login(loginAccountRequest),
    );

    return account;
  }

  private async login(
    loginAccountRequest: LoginAccountRequest,
  ): Promise<Account> {
    const account = await this.accountRepository.findByEmail(
      loginAccountRequest.email,
      ['identities'],
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
