import { WalletsService } from '../wallets/wallet.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { RolesEnum, Users } from './user.entity';
import { CreateAdminDTO } from './user.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private readonly walletsService: WalletsService,
    private dataSource: DataSource,
  ) {}

  async createUser(user: Partial<Users>): Promise<Users> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
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
        roles: RolesEnum.Client,
      });

      await queryRunner.manager.save(createdUser);

      const currency = user.currency;
      const createdWallet = await this.walletsService.createWallet(
        createdUser,
        currency,
        queryRunner,
      );

      createdUser.wallet = createdWallet;
      await queryRunner.manager.save(createdUser);
      await queryRunner.commitTransaction();

      return createdUser;
    } catch (err) {
      // since we have errors lets rollback the changes we made
      await queryRunner.rollbackTransaction();
      return err;
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  async findByEmail(userEmail: string): Promise<Users | undefined> {
    return await this.userRepository.findOne({
      where: { email: userEmail },
    });
  }

  async findById(id): Promise<Users | undefined> {
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
      currency: 'N/A',
      roles: role,
    });
    await this.userRepository.save(createdAdmin);
    return createdAdmin;
  }
  async findAllUsers() {
    return await this.userRepository.find();
  }
}
