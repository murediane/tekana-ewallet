// // wallet.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, ClientSession } from 'mongoose';

import { Wallet, WalletDocument } from './wallet.schema';


@Injectable()
export class WalletsService {
  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
  ) {}

  async createWallet(
    userId: Types.ObjectId,
    currency: string,
    session: ClientSession,
  ): Promise<WalletDocument> {
    const newWallet = new this.walletModel({
      userId,
      currency,
      balance: 0,
    });

    // save the instance, make sure to pass the session
    return await newWallet.save({ session });
  }

  async findAllWallets(): Promise<WalletDocument[]> {
    return await this.walletModel.find().exec();
  }

  async findWalletByUserEmail(email: string): Promise<Wallet> {
    const wallets = await this.walletModel.aggregate([
      {
        $lookup: {
          from: 'users', // 'users' should be your user collection name
          localField: 'userId', // the field from the "wallets" collection
          foreignField: '_id', // the field from the "users" collection
          as: 'user_info', // the resulting array with user info
        },
      },
      { $unwind: '$user_info' }, // deconstruct the array
      { $match: { 'user_info.email': email } }, // condition to match the email
    ]);

    if (!wallets.length) {
      throw new NotFoundException(
        `Wallet for user with email ${email} not found`,
      );
    }

    return wallets[0]; // because aggregation returns an array, we get the first match
  }
}
