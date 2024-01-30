import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Wallet } from '../wallet/entities/wallet.entity';
import { IsEnum } from 'class-validator';

export enum RolesEnum {
  SuperAdmin = 'superAdmin',
  Admin = 'admin',
  Agent = 'agent',
  Client = 'client',
}

@Entity({ name: 'USER' })
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
  @IsEnum(RolesEnum)
  roles: string;

  @OneToOne(() => Wallet, { eager: true, cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'walletId' })
  wallet: Wallet;

  @Column()
  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column()
  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
