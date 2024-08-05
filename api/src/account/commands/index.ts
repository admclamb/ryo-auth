import { CreateAccountHandler } from './create-account/create-account.handler';
import { LoginAccountHandler } from './login-account/login-account.handler';

export const AccountCommandHandlers = [
  CreateAccountHandler,
  LoginAccountHandler,
];
