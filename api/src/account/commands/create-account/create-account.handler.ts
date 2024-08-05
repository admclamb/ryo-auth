import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateAccountCommand } from './create-account.command';
import { AccountFactory } from 'src/account/factories/account.factory';
import { Account } from 'src/db';
import { PasswordManager } from 'src/common/password/password-manager';

@CommandHandler(CreateAccountCommand)
export class CreateAccountHandler
  implements ICommandHandler<CreateAccountCommand>
{
  constructor(
    private readonly eventPublisher: EventPublisher,
    private readonly accountFactory: AccountFactory,
    private readonly passwordManager: PasswordManager,
  ) {}

  async execute({
    createAccountRequest,
  }: CreateAccountCommand): Promise<Account> {
    createAccountRequest.password = await this.passwordManager.hash(
      createAccountRequest.password,
    );

    const account = this.eventPublisher.mergeObjectContext(
      await this.accountFactory.create(createAccountRequest),
    );

    return account;
  }
}
