import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';

import { Wallet } from './entities/wallet.entity';
import { User } from '../user/user.entity';
import { WalletTransaction } from './entities/transactions.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, QueryRunner, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { TopupwalletRequestDTO, TransferRequestDTO } from './wallet.dto';
import { AppEnums } from '../../common/enum';

@Injectable()
export class WalletService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
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
      ![
        AppEnums.RolesEnum.Admin,
        AppEnums.RolesEnum.Agent,
        AppEnums.RolesEnum.SuperAdmin,
      ].some((role) => currentUser.role.includes(role))
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
    walletId: number,
    topupwalletDto: TopupwalletRequestDTO,
    currentUser: any,
  ): Promise<Wallet> {
    if (!currentUser.role.includes(AppEnums.RolesEnum.Admin)) {
      throw new UnauthorizedException('Only admins can top up a wallet');
    }

    const wallet = await this.walletRepository.findOne({
      where: { id: walletId },
    });

    if (!wallet) {
      throw new NotFoundException(
        `Wallet for user with ID ${walletId} not found`,
      );
    }

    // Update wallet balance
    wallet.balance += topupwalletDto.amount;

    await this.walletRepository.save(wallet);

    // Create a new transaction
    const transaction = this.waletTransactionRepository.create({
      amount: topupwalletDto.amount,
      currency: topupwalletDto.currency,
      transactionInitiatorId: currentUser,
      fromWallet: null, // since it's a top-up, there's no source wallet
      toWallet: wallet,
      transactionType: AppEnums.TransactionTypeEnum.Topup,
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.waletTransactionRepository.save(transaction);

    return wallet;
  }

  async transferFunds(
    senderUserId: number,
    transferRequestDTO: TransferRequestDTO,
  ): Promise<WalletTransaction> {
    // Find sender's wallet
    const senderWallet = await this.walletRepository.findOne({
      where: { user: { id: senderUserId } },
    });

    const senderUser = await this.userRepository.findOne({
      where: { id: senderUserId },
    });

    if (!senderWallet) {
      throw new NotFoundException(`Sender's wallet not found`);
    }

    if (senderWallet.currency !== transferRequestDTO.currency) {
      throw new BadRequestException(`Currency mismatch in sender's wallet`);
    }

    if (senderWallet.balance < transferRequestDTO.amount) {
      throw new BadRequestException("Insufficient funds in sender's wallet");
    }
    const receiverUser = await this.userService.findByEmail(
      transferRequestDTO.receiverEmail,
    );
    // Find receiver's wallet
    const receiverWallet = await this.walletRepository.findOne({
      where: { id: receiverUser.wallet.id },
    });

    if (!receiverWallet) {
      throw new NotFoundException(`Receiver's wallet not found`);
    }

    if (receiverWallet.currency !== transferRequestDTO.currency) {
      throw new BadRequestException(`Currency mismatch in receiver's wallet`);
    }

    // Update balances
    senderWallet.balance -= transferRequestDTO.amount;

    receiverWallet.balance += transferRequestDTO.amount;

    await this.walletRepository.save(senderWallet);

    await this.walletRepository.save(receiverWallet);

    // Record the transaction
    const transactionData = await this.waletTransactionRepository.create({
      transactionInitiatorId: senderUser,
      currency: transferRequestDTO.currency,
      amount: transferRequestDTO.amount,
      fromWallet: senderWallet,
      toWallet: receiverWallet,
      transactionType: AppEnums.TransactionTypeEnum.transfer,
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.waletTransactionRepository.save(transactionData);
    // this.eventEmitter.emit('transaction.successful', { transactionData });

    return transactionData;
  }

  async findAllTransactionsByWalletId(
    walletId: number,
  ): Promise<WalletTransaction[]> {
    try {
      const transactions = await this.waletTransactionRepository.find({
        where: [{ fromWallet: Equal(walletId) }, { toWallet: Equal(walletId) }],
      });

      return transactions;
    } catch (error) {
      throw new BadRequestException(`transaction not found for this user`);
    }
  }
}
