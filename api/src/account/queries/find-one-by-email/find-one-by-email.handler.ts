import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindOneByEmailQuery } from './find-one-by-email.query';
import { AccountDto } from 'src/account/dto/account.dto';
import { AccountRepository } from 'src/account/repositories';
import { AccountFactory } from 'src/account/factories';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(FindOneByEmailQuery)
export class FindOneByEmailHandler
  implements IQueryHandler<FindOneByEmailQuery>
{
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly accountFactory: AccountFactory,
  ) {}
  async execute({ email }: FindOneByEmailQuery): Promise<AccountDto> {
    const account = await this.accountRepository.findByEmail(email);

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return this.accountFactory.createDto(account);
  }
}
