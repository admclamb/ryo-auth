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
import { CookieService } from 'src/auth/cookie.service';

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
    LocalStrategy,
    JwtService,

    {
      provide: 'BCRYPT',
      useValue: bcrypt,
    },
    {
      provide: CookieService,
      useFactory: (configService: ConfigService) => {
        const IS_PRODUCTION: boolean =
          configService.get<string>('NODE_ENV') === 'production';
        const DOMAIN: string = configService.get<string>('DOMAIN');
        return new CookieService({
          httpOnly: true,
          secure: IS_PRODUCTION,
          sameSite: 'lax',
          path: '/',
          domain: IS_PRODUCTION ? DOMAIN : '',
          maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        });
      },
      inject: [ConfigService],
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
