import {
  Entity,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Identity } from './identity.schema';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: string;

  @OneToMany(() => Identity, (identity) => identity.account)
  identities: Identity[];

  @Column({ nullable: false })
  email: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  nickname: string;

  @Column({ nullable: false })
  picture: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  readonly createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  readonly updatedAt: Date;
}
