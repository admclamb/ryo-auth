import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityFactory } from 'src/common/factory/entity.factory';
import { Account } from 'src/db';
import { CreateAccountRequest } from '../dto/request/create-account-request.dto';
import { AccountRepository, ConnectionRepository } from '../repositories';
import { AccountDto } from '../dto/account.dto';
import { IdentityFactory } from './identity.factory';

@Injectable()
export class AccountFactory implements EntityFactory<Account, AccountDto> {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly connectionRepository: ConnectionRepository,
    private readonly identityFactory: IdentityFactory,
  ) {}

  createDto(account: Account): AccountDto {
    return {
      id: account.id,
      email: account.email,
      isEmailVerified: account.isEmailVerified,
      identities:
        account.identities?.map((identity) =>
          this.identityFactory.createDto(identity),
        ) ?? [],
      name: account.name,
      nickname: account.nickname,
      picture: account.picture,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    };
  }

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

    if (await this.doesEmailExist(createAccountRequest.email)) {
      throw new ConflictException('Account with that email already exists');
    }

    const account = await this.accountRepository.create(
      createAccountRequest,
      foundConnection,
    );
    return account;
  }

  private async doesEmailExist(email: string): Promise<boolean> {
    const account = await this.accountRepository.findByEmail(email);
    return account !== null;
  }
}
