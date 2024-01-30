import { User } from '../../user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Wallet } from './wallet.entity';

export enum TransactionTypeEnum {
  Topup = 'topup',
  transfer = 'transfer',
}

@Entity({ name: 'WALLETTRANSACTION' })
export class WalletTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  transactionInitiatorId: User;

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
