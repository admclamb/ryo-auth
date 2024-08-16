import { Module } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account, Connection, Identity } from 'src/db';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule,
    CqrsModule,
    TypeOrmModule.forFeature([Account, Identity, Connection]),
    JwtModule.register({
      secret: 'my-secret',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [LocalStrategy],
})
export class AuthModule {}
