import { WalletsService } from '../wallets/wallet.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateAdminDTO, RolesEnum, User, UserDocument } from './user.dtos';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly walletsService: WalletsService, // inject  wallets service
  ) {}

  async createUser(user: Partial<User>): Promise<User> {
    const session = await this.userModel.db.startSession();
    session.startTransaction();
    try {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const userExist = await this.findByEmail(user.email);
      if(userExist){
        throw new BadRequestException('user already exist');
      }

      // create a new instance of the model
      let createdUser = new this.userModel({
        ...user,
        password: hashedPassword,
        roles: RolesEnum.Client,
      });

      // save the instance
      createdUser = await createdUser.save({ session });

      const currency = user.currency;
      const createdWallet = await this.walletsService.createWallet(createdUser._id, currency, session);

      createdUser.walletId = createdWallet._id;
      await createdUser.save({ session });

      await session.commitTransaction();

      return createdUser;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
  
  async findByEmail(userEmail: string): Promise<User | undefined> {
    return this.userModel.findOne({ email: userEmail }).exec();
  }

  async findById(userId: Types.ObjectId): Promise<User | undefined> {
    return this.userModel.findOne({ _id:userId}).exec();
  }
  async createAdminUser(payload:CreateAdminDTO){
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const  role = payload.roles
    const userExist = await this.findByEmail(payload.email);
    if(userExist){
     throw new BadRequestException('user already exist');
    }
    let createdAdmin = await this.userModel.create({
      ...payload,
      password: hashedPassword,
      roles:[role]
    });
    return createdAdmin;
  }
  async  findAllUsers() :Promise<UserDocument[]> {
    return await this.userModel.find().exec();
  }

}
