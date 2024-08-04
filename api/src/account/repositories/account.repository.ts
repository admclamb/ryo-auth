import { Account, Connection } from 'src/db';
import { Repository } from 'typeorm';
import { CreateAccountRequest } from '../dto/request/create-account-request.dto';
import { InjectRepository } from '@nestjs/typeorm';

export class AccountRepository {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  create(
    createAccountRequest: CreateAccountRequest,
    connection: Connection,
  ): Promise<Account> {
    return this.accountRepository.save({
      ...createAccountRequest,
      connection,
      name: createAccountRequest.email,
      email: createAccountRequest.email,
      nickname: createAccountRequest.email.split('@')[0] ?? '',
    });
  }
}
