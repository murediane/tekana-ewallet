import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { TransactionTypeEnum } from './entities/transactions.entity';

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
export class TopupwalletDTO {
  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  currency: string;
}

export class TransactionData {
  amount: number;
  currency: string;
  transactionInitiatorId: string;
  fromWalletId: string | null;
  toWalletId: string;
  transactionType: TransactionTypeEnum;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
