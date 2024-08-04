import { IdentityDto } from './identity.dto';

export interface AccountDto {
  id: string;
  email: string;
  emailVerified: boolean;
  identities: IdentityDto[];
  name: string;
  nickname: string;
  picture: string;
  createdAt: Date;
  updatedAt: Date;
}
