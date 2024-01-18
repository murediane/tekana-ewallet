import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
} from 'typeorm';
import { Wallet } from '../wallets/entities/wallet.entity';

export enum RolesEnum {
  SuperAdmin = 'superAdmin',
  Admin = 'admin',
  Agent = 'agent',
  Client = 'client',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phoneNumber: string;

  @Column()
  country: string;

  @Column()
  currency: string;

  @Column()
  roles: string;

  @OneToOne(() => Wallet, { eager: true, cascade: true })
  @JoinColumn({ name: 'walletId' })
  wallet: Wallet;

  @Column()
  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column()
  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
