import { Users } from 'src/modules/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Users, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @Column()
  currency: string;

  @Column()
  balance: number;
}
