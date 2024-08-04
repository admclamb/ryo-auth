import { AccountRepository } from './account.repository';
import { ConnectionRepository } from './connection.repository';
import { IdentityRepository } from './identity.repository';

const AccountRepositories = [
  AccountRepository,
  ConnectionRepository,
  IdentityRepository,
];

export { AccountRepository, ConnectionRepository, IdentityRepository };

export default AccountRepositories;
