import { Account, Connection } from 'src/db';
import { Repository } from 'typeorm';
import { CreateAccountRequest } from '../dto/request/create-account-request.dto';
import { InjectRepository } from '@nestjs/typeorm';

export class AccountRepository {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  findByName(name: string, relations: string[] = []): Promise<Account | null> {
    if (!name) {
      return null;
    }

    return (
      this.accountRepository.findOne({ where: { name }, relations }) ?? null
    );
  }

  findByEmail(
    email: string,
    relations: string[] = [],
  ): Promise<Account | null> {
    if (!email) {
      return null;
    }

    return (
      this.accountRepository.findOne({ where: { email }, relations }) ?? null
    );
  }

  create(
    createAccountRequest: CreateAccountRequest,
    connection: Connection,
  ): Promise<Account> {
    return this.accountRepository.save({
      ...createAccountRequest,
      identities: [
        {
          connection: connection,
          password: createAccountRequest.password,
        },
      ],
      name: createAccountRequest.email,
      email: createAccountRequest.email,
      nickname: createAccountRequest.email.split('@')[0] ?? '',
    });
  }
}
