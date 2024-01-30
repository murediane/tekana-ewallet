import { User } from '../../user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'WALLET' })
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  // @OneToOne(() => User, (user) => user.id)
  // @JoinColumn({ name: 'userId' })
  // user: User;
  @OneToOne(() => User, (user) => user.wallet)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  currency: string;

  @Column()
  balance: number;
}
