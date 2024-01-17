import { WalletsService } from '../wallets/wallet.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { RolesEnum, User } from './user.entity';
import { CreateAdminDTO } from './user.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { Wallet } from '../wallets/entities/wallet.entity';

@Injectable()
export class UsersService {
  // constructor(
  //   @InjectRepository(User)
  //   private readonly userRepository: Repository<User>,
  //   private readonly walletsService: WalletsService, // inject  wallets service
  // ) {}
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly walletsService: WalletsService,
  ) {}

  // async createUser(user: Partial<User>): Promise<User> {
  //   const session = await this.userModel.db.startSession();
  //   session.startTransaction();
  //   try {
  //     const hashedPassword = await bcrypt.hash(user.password, 10);
  //     const userExist = await this.findByEmail(user.email);
  //     if (userExist) {
  //       throw new BadRequestException('user already exist');
  //     }

  //     // create a new instance of the model
  //     let createdUser = new this.userModel({
  //       ...user,
  //       password: hashedPassword,
  //       roles: RolesEnum.Client,
  //     });

  //     // save the instance
  //     createdUser = await createdUser.save({ session });

  //     const currency = user.currency;
  //     const createdWallet = await this.walletsService.createWallet(
  //       createdUser._id,
  //       currency,
  //       session,
  //     );

  //     createdUser.walletId = createdWallet._id;
  //     await createdUser.save({ session });

  //     await session.commitTransaction();

  //     return createdUser;
  //   } catch (error) {
  //     await session.abortTransaction();
  //     throw error;
  //   } finally {
  //     session.endSession();
  //   }
  // }

  @Transactional()
  async createUser(user: Partial<User>, manager: EntityManager): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const userExist = await this.userRepository.findOne({
      where: { email: user.email },
    });
    if (userExist) {
      throw new BadRequestException('User already exists');
    }

    const createdUser = this.userRepository.create({
      ...user,
      password: hashedPassword,
      roles: [RolesEnum.Client],
    });

    await manager.save(createdUser);

    const currency = user.currency;
    const createdWallet = await this.walletsService.createWallet(
      createdUser.id,
      currency,
      manager,
    );

    createdUser.walletId = createdWallet.id as unknown as Wallet;
    await manager.save(createdUser);

    return createdUser;
  }

  async findByEmail(userEmail: string): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: { email: userEmail },
    });
  }

  async findById(id): Promise<User | undefined> {
    return this.userRepository.findOne(id);
  }
  async createAdminUser(payload: CreateAdminDTO) {
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const role = payload.roles as unknown as RolesEnum;
    const userExist = await this.findByEmail(payload.email);
    if (userExist) {
      throw new BadRequestException('user already exist');
    }
    const createdAdmin = this.userRepository.create({
      ...payload,
      password: hashedPassword,
      roles: [role],
    });
    return createdAdmin;
  }
  async findAllUsers() {
    return await this.userRepository.find();
  }
}
