import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types, ClientSession } from 'mongoose';

import { Wallet, WalletDocument } from './schemas/wallet.schema';
import { RolesEnum } from '../users/user.dtos';
import {
  Transaction,
  TransactionDocument,
  TransactionTypeEnum,
} from './schemas/transactions.schema';
import { UsersService } from '../users/user.service';

@Injectable()
export class WalletsService {
  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
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

  async findWalletByUserEmail(
    email: string,
    currentUser: any,
  ): Promise<Wallet> {
    if (
      email !== currentUser.email &&
      ![RolesEnum.Admin, RolesEnum.Agent, RolesEnum.SuperAdmin].some((role) =>
        currentUser.roles.includes(role),
      )
    ) {
      throw new ForbiddenException(
        'You do not have permission to access this wallet.',
      );
    }

    const wallets = await this.walletModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user_info',
        },
      },
      { $unwind: '$user_info' },
      { $match: { 'user_info.email': email } },
    ]);

    if (!wallets.length) {
      throw new NotFoundException(
        `Wallet for user with email ${email} not found`,
      );
    }

    return wallets[0];
  }
  async adminTopUpWallet(
    userId: string,
    amount: number,
    currency: string,
    currentUser: any,
  ): Promise<Wallet> {
    const initiatorId = currentUser.id;
    if (!currentUser.roles.includes('admin')) {
      throw new UnauthorizedException('Only admins can top up a wallet');
    }
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const wallet = await this.walletModel
      .findOne({ userId: userObjectId })
      .exec();

    if (!wallet) {
      throw new NotFoundException(
        `Wallet for user with ID ${userId} not found`,
      );
    }

    // Update wallet balance
    wallet.balance += amount;
    await wallet.save();

    // Create a new transaction
    const transaction = new this.transactionModel({
      amount: amount,
      currency: currency,
      transactionInitiatorId: initiatorId,
      fromWalletId: null, // since it's a top-up, there's no source wallet
      toWalletId: wallet._id,
      transactionType: TransactionTypeEnum.Topup,
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await transaction.save();

    return wallet;
  }

  async transferFunds(
    senderUserId: Types.ObjectId,
    receiverUserEmail: string,
    amount: number,
    currency: string,
  ): Promise<Transaction> {
    // Find sender's wallet
    const senderWallet = await this.walletModel.findOne({
      userId: senderUserId,
    });

    if (!senderWallet) {
      throw new NotFoundException(`Sender's wallet not found`);
    }

    if (senderWallet.currency !== currency) {
      throw new BadRequestException(`Currency mismatch in sender's wallet`);
    }

    if (senderWallet.balance < amount) {
      throw new BadRequestException("Insufficient funds in sender's wallet");
    }
    const receiverUser = await this.userService.findByEmail(receiverUserEmail);
    // Find receiver's wallet
    const receiverWallet = await this.walletModel.findOne({
      _id: receiverUser.walletId,
    });

    if (!receiverWallet) {
      throw new NotFoundException(`Receiver's wallet not found`);
    }

    if (receiverWallet.currency !== currency) {
      throw new BadRequestException(`Currency mismatch in receiver's wallet`);
    }

    // Update balances
    senderWallet.balance -= amount;
    receiverWallet.balance += amount;

    await senderWallet.save();
    await receiverWallet.save();

    // Record the transaction
    const transaction = new this.transactionModel({
      transactionInitiatorId: senderUserId,
      currency: currency,
      amount: amount,
      fromWalletId: senderWallet._id,
      toWalletId: receiverWallet._id,
      transactionType: TransactionTypeEnum.transfer,
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await transaction.save();

    return transaction;
  }
  async findTransactionsByUserId(
    userId: Types.ObjectId,
  ): Promise<Transaction[]> {
    const walletUser = await this.userService.findById(userId);
    // Look for transactions where the user is the initiator or the transaction affects their wallet
    const transactions = await this.transactionModel
      .find({
        $or: [
          { transactionInitiatorId: userId },
          { fromWalletId: walletUser.walletId },
          { toWalletId: walletUser.walletId },
        ],
      })
      .exec();

    if (!transactions) {
      throw new NotFoundException('No transactions found for this user');
    }

    return transactions;
  }
}
