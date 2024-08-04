import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Identity } from './identity.schema';

@Entity()
export class Connection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  connectionType: string;

  @OneToMany(() => Identity, (identity) => identity.connection)
  identities: Promise<Identity[]>;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  readonly createdAt: Date;
}
