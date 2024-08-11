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
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'src/auth/local.strategy';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([Account, Identity, Connection]),
    PassportModule,
  ],
  controllers: [AccountController],
  providers: [
    ...AccountCommandHandlers,
    ...AccountFactories,
    ...AccountRepositories,
    LocalStrategy,
    JwtService,
    {
      provide: 'BCRYPT',
      useValue: bcrypt,
    },
    {
      provide: PasswordManager,
      useFactory: (bcrypt: Bcrypt, configService: ConfigService) => {
        const SALT_ROUNDS = configService.get<string>('BCRYPT_SALT_ROUNDS');
        return new PasswordManager(bcrypt, Number(SALT_ROUNDS));
      },
      inject: ['BCRYPT', ConfigService],
    },
  ],
})
export class AccountModule {}
