import { LoginAccountRequest } from 'src/account/dto/request/login-account-request.dto';

export class LoginAccountCommand {
  constructor(public readonly loginAccountRequest: LoginAccountRequest) {}
}
