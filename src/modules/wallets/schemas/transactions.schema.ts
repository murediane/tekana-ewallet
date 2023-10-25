import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum TransactionTypeEnum {
  Topup = 'topup',
  transfer = 'transfer',
}

export type TransactionDocument = Transaction & Document;

@Schema()
export class Transaction {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  transactionInitiatorId: Types.ObjectId;

  @Prop({ required: true })
  currency: string;

  @Prop({ default: 0 })
  balance: number;
  @Prop({ required: true })
  amount: number;

  @Prop({ required: false, type: Types.ObjectId, ref: 'Wallet' })
  fromWalletId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Wallet' })
  toWalletId: Types.ObjectId;

  @Prop({ required: true })
  transactionType: TransactionTypeEnum[];

  @Prop({ required: true })
  status: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export class TopupwalletDTO {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  currency: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
