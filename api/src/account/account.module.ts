import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account, Connection, Identity } from 'src/db';
import { AccountCommandHandlers } from './commands';
import AccountFactories from './factories';
import AccountRepositories from './repositories';

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
  ],
})
export class AccountModule {}
