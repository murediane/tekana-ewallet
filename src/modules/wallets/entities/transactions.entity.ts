import { Users } from '../../users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Wallet } from './wallet.entity';

export enum TransactionTypeEnum {
  Topup = 'topup',
  transfer = 'transfer',
}

@Entity()
export class WalletTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.id)
  transactionInitiatorId: Users;

  @Column()
  currency: string;

  @Column()
  amount: number;

  @ManyToOne(() => Wallet, (wallet) => wallet.id, { cascade: true })
  fromWallet: Wallet;

  @ManyToOne(() => Wallet, (wallet) => wallet.id, { cascade: true })
  toWallet: Wallet;

  @Column()
  transactionType: TransactionTypeEnum;

  @Column()
  status: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
