import { User } from 'src/modules/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type WalletDocument = Wallet & Document;

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'id' })
  userId: User;

  @Column()
  currency: string;

  @Column()
  balance: number;
  static id: Wallet;
}
