import { Wallet } from '../wallets/entities/wallet.entity';
import { RolesEnum } from './User.entity';
export class CreateAdminDTO {
  email: string;

  password: string;
  firstName: string;

  lastName: string;

  phoneNumber: string;

  roles: RolesEnum;
}

export class CreateUserDTO {
  email: string;
  password: string;

  firstName: string;
  lastName: string;

  phoneNumber: string;

  country: string;

  currency: string;
  roles: RolesEnum[];

  walletId: Wallet;
}