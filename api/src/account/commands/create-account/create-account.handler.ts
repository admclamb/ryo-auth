import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateAccountCommand } from './create-account.command';
import { AccountFactory } from 'src/account/factories/account.factory';
import { Account } from 'src/db';
import { PasswordManager } from 'src/common/password/password-manager';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@CommandHandler(CreateAccountCommand)
export class CreateAccountHandler
  implements ICommandHandler<CreateAccountCommand>
{
  constructor(
    private readonly eventPublisher: EventPublisher,
    private readonly accountFactory: AccountFactory,
    private readonly passwordManager: PasswordManager,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute({ createAccountRequest }: CreateAccountCommand): Promise<{
    accessToken: string;
    refreshToken: string;
    account: Account;
  }> {
    createAccountRequest.password = await this.passwordManager.hash(
      createAccountRequest.password,
    );

    const account = this.eventPublisher.mergeObjectContext(
      await this.accountFactory.create(createAccountRequest),
    );

    return {
      account,
      accessToken: this.createToken(account, {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: '30d',
      }),
      refreshToken: this.createToken(account, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: '15min',
      }),
    };
  }

  private createToken(
    account: Account,
    signOptions: JwtSignOptions = {},
  ): string {
    const payload = {
      name: account.name,
      sub: account.id,
    };

    return this.jwtService.sign(payload, signOptions);
  }
}
