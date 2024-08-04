import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateAccountCommand } from './create-account.command';
import { AccountFactory } from 'src/account/factories/account.factory';
import { Account } from 'src/db';

@CommandHandler(CreateAccountCommand)
export class CreateAccountHandler
  implements ICommandHandler<CreateAccountCommand>
{
  constructor(
    private readonly eventPublisher: EventPublisher,
    private readonly accountFactory: AccountFactory,
  ) {}

  async execute({
    createAccountRequest,
  }: CreateAccountCommand): Promise<Account> {
    const account = this.eventPublisher.mergeObjectContext(
      await this.accountFactory.create(createAccountRequest),
    );

    return account;
  }
}
