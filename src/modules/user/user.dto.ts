import { Wallet } from '../wallet/entities/wallet.entity';
import { AppEnums } from '../../common/enum';
export class CreateAdminDTO {
  email: string;

  password: string;
  firstName: string;

  lastName: string;

  phoneNumber: string;

  role: typeof AppEnums.RolesEnum;
}

export class CreateUserDTO {
  email: string;
  password: string;

  firstName: string;
  lastName: string;

  phoneNumber: string;

  country: string;

  currency: string;

  role: string;

  walletId: Wallet;
}
