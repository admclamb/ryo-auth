import { IsNotEmpty, IsString } from 'class-validator';

export class LoginAccountRequest {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
