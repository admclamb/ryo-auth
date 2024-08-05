import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account, Connection, Identity } from 'src/db';
import { AccountCommandHandlers } from './commands';
import AccountFactories from './factories';
import AccountRepositories from './repositories';
import * as bcrypt from 'bcrypt';
import { PasswordManager } from 'src/common/password/password-manager';
import { ConfigService } from '@nestjs/config';
import { Bcrypt } from 'src/common/password/bcrypt.types';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Account, Identity, Connection]),
  ],
  controllers: [AccountController],
  providers: [
    ...AccountCommandHandlers,
    ...AccountFactories,
    ...AccountRepositories,
    {
      provide: 'BCRYPT',
      useValue: bcrypt,
    },
    {
      provide: PasswordManager,
      useFactory: (bcrypt: Bcrypt, configService: ConfigService) => {
        const salt = configService.get<string>('BCRYPT_SALT');
        return new PasswordManager(bcrypt, Number(salt));
      },
      inject: ['BCRYPT', ConfigService],
    },
  ],
})
export class AccountModule {}
