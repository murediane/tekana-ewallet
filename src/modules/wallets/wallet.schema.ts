// // create-wallet.dto.ts
// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
// import { Types } from 'mongoose';

// export type WalletDocument = Wallet & Document;

// @Schema()
// export class Wallet{
//     @Prop({ required: true, type: Types.ObjectId, ref: 'User' }) 
//     userId: Types.ObjectId;

//   @Prop({ default: 0 })
//   @IsNumber()
//   @IsOptional() 
//   balance: number;
  
//   @Prop({ required: true })
//   @IsNotEmpty()
//   @IsString()
//   currency: string;
// }
// export const WalletSchema = SchemaFactory.createForClass(Wallet);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type WalletDocument = Wallet & Document;

@Schema()
export class Wallet {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true })
  currency: string;

  @Prop({ default: 0 })
  balance: number;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
