// create-wallet.dto.ts
import { ObjectId } from 'bson';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { SchemaType, Types } from 'mongoose';

import { UserSchema } from '../users/user.dtos';

export class CreateWalletDto {
  @IsNotEmpty()
  userId: Types.ObjectId;

  @IsNumber()
  @IsOptional() // It's optional because we'll set it to 0 by default
  balance: number;

  @IsNotEmpty()
  @IsString()
  currency: string;
}
