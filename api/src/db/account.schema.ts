import {
  Entity,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Identity } from './identity.schema';
import { AggregateRoot } from '@nestjs/cqrs';

@Entity()
export class Account extends AggregateRoot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Identity, (identity) => identity.account, {
    cascade: true,
  })
  identities: Identity[];

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  nickname: string;

  @Column({ nullable: true })
  picture: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  readonly createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  readonly updatedAt: Date;
}
