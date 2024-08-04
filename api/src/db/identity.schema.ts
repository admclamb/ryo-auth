import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Account } from './account.schema';
import { Connection } from './connection.schema';

@Entity()
export class Identity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Connection, (connection) => connection.identities)
  connection: Connection;

  @ManyToOne(() => Account, (account) => account.identities)
  account: Account;

  @Column()
  password: string;
}
