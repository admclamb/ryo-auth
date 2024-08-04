import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityFactory } from 'src/common/factory/entity.factory';
import { Account } from 'src/db';
import { CreateAccountRequest } from '../dto/request/create-account-request.dto';
import { AccountRepository, ConnectionRepository } from '../repositories';

@Injectable()
export class AccountFactory implements EntityFactory<Account> {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly connectionRepository: ConnectionRepository,
  ) {}

  async create(createAccountRequest: CreateAccountRequest): Promise<Account> {
    const foundConnection =
      await this.connectionRepository.findByConnectionType(
        createAccountRequest.connection,
      );

    if (!foundConnection) {
      throw new NotFoundException(
        `Connection type '${createAccountRequest.connection}' does not exist`,
      );
    }

    const account = await this.accountRepository.create(
      createAccountRequest,
      foundConnection,
    );
    return account;
  }
}
