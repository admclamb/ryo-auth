import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Account } from './account.schema';

@Entity()
export class Identity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, length: 75 })
  connection: string;

  @ManyToOne(() => Account, (account) => account.identities)
  account: Account;
}
