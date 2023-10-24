import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import { Document, Types } from 'mongoose';

export enum RolesEnum{
  SuperAdmin = 'superAdmin',
  Admin = 'admin',
  Agent = 'agent',
  Client = 'client',
  
}

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  country: string;
  @Prop({ required: true })
  currency: string;

@Prop({require :true})
  roles: RolesEnum[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'Wallet' })
  walletId: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
