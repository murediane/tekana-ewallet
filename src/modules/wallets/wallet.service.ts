import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';

import { Wallet } from './entities/wallet.entity';
import { RolesEnum, User } from '../users/user.entity';
// import { TransactionData } from './wallet.dto';
import {
  WalletTransaction,
  TransactionTypeEnum,
} from './entities/transactions.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { UsersService } from '../users/user.service';

@Injectable()
export class WalletsService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(WalletTransaction)
    private readonly waletTransactionRepository: Repository<WalletTransaction>,
  ) {}

  async createWallet(
    user: User,
    currency: string,
    queryRunner: QueryRunner,
  ): Promise<Wallet> {
    // Find the user using the userRepository

    const newWallet = this.walletRepository.create({
      user, // Provide the user instance
      currency,
      balance: 0,
    });

    // Save the wallet instance
    await queryRunner.manager.save(newWallet);
    return newWallet;
  }

  async findAllWallets() {
    return await this.walletRepository.find();
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

    const wallet = await this.walletRepository
      .createQueryBuilder('wallet')
      .leftJoinAndSelect('wallet.user', 'user')
      .where('user.email = :email', { email })
      .getOne();

    if (!wallet) {
      throw new NotFoundException(
        `Wallet for user with email ${email} not found`,
      );
    }

    return wallet;
  }

  async adminTopUpWallet(
    userId: number,
    amount: number,
    currency: string,
    currentUser: any,
  ): Promise<Wallet> {
    if (!currentUser.roles.includes('admin')) {
      throw new UnauthorizedException('Only admins can top up a wallet');
    }

    const wallet = await this.walletRepository.findOne({
      where: { id: userId },
    });

    if (!wallet) {
      throw new NotFoundException(
        `Wallet for user with ID ${userId} not found`,
      );
    }

    // Update wallet balance
    wallet.balance += amount;
    await this.walletRepository.save(wallet);

    // Create a new transaction
    const transaction = this.waletTransactionRepository.create({
      amount: amount,
      currency: currency,
      transactionInitiator: currentUser,
      fromWallet: null, // since it's a top-up, there's no source wallet
      toWallet: wallet,
      transactionType: TransactionTypeEnum.Topup,
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.waletTransactionRepository.save(transaction);

    return wallet;
  }

  async transferFunds(
    senderUserId: number,
    receiverUserEmail: string,
    amount: number,
    currency: string,
  ): Promise<WalletTransaction> {
    // Find sender's wallet
    const senderWallet = await this.walletRepository.findOne({
      where: { id: senderUserId },
    });

    const senderUser = await this.userRepository.findOne({
      where: { id: senderUserId },
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
    const receiverWallet = await this.walletRepository.findOne({
      where: { id: receiverUser.wallet.id },
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

    await this.walletRepository.save(senderWallet);
    await this.walletRepository.save(receiverWallet);

    // Record the transaction
    const transaction = await this.waletTransactionRepository.create({
      transactionInitiator: senderUser,
      currency: currency,
      amount: amount,
      fromWallet: senderWallet,
      toWallet: receiverWallet,
      transactionType: TransactionTypeEnum.transfer,
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.walletRepository.save(transaction);

    return transaction;
  }
  async findTransactionsByUserId(userId: number): Promise<WalletTransaction[]> {
    const walletUser = await this.userService.findById(userId);
    // Look for transactions where the user is the initiator or the transaction affects their wallet
    const transactions = await this.waletTransactionRepository.find({
      where: [
        { transactionInitiator: walletUser },
        { fromWallet: walletUser },
        { toWallet: walletUser },
      ],
    });

    if (!transactions) {
      throw new NotFoundException('No transactions found for this user');
    }

    return transactions;
  }
}
