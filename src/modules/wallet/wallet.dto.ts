import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { AppEnums } from '../../common/enum';
export class CreateWalletDto {
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsOptional()
  balance: number;

  @IsNotEmpty()
  @IsString()
  currency: string;
}
export class TopupwalletRequestDTO {
  @IsNotEmpty()
  amount: number;

  @IsString()
  currency: string;
}
export class TransferRequestDTO {
  @IsNotEmpty()
  receiverEmail: string;

  @IsNotEmpty()
  amount: number;

  @IsString()
  currency: string;
}

export class TransactionData {
  amount: number;
  currency: string;
  transactionInitiatorId: string;
  fromWalletId: string | null;
  toWalletId: string;
  transactionType: typeof AppEnums.TransactionTypeEnum;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
