import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
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
  roles: RolesEnum[];

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @OneToOne(() => Wallet, (wallet) => wallet.id)
  @JoinColumn({ name: 'id' })
  walletId: Wallet;
}
