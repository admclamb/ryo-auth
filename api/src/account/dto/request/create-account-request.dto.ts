import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateAccountRequest {
  @IsString()
  connection: string;

  @IsString()
  username: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
