import { Module } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account, Connection, Identity } from 'src/db';

@Module({
  imports: [
    PassportModule,
    CqrsModule,
    TypeOrmModule.forFeature([Account, Identity, Connection]),
  ],
  providers: [LocalStrategy],
})
export class AuthModule {}
