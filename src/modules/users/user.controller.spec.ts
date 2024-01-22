import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppModule } from '../../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RolesEnum, Users } from './user.entity';
import { Wallet } from '../wallets/entities/wallet.entity';
import { WalletTransaction } from '../wallets/entities/transactions.entity';
import { Repository } from 'typeorm';
import { TestDatabaseModule } from '../../config/test.configuration';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<Users>;
  let walletRepository: Repository<Wallet>;
  let walletTransactionRepository: Repository<WalletTransaction>;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule, TestDatabaseModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userRepository = moduleFixture.get(getRepositoryToken(Users));
    walletRepository = moduleFixture.get(getRepositoryToken(Wallet));
    walletTransactionRepository = moduleFixture.get(
      getRepositoryToken(WalletTransaction),
    );
    await app.init();
  });

  it('/users (POST)', async () => {
    const userPayload = {
      email: 'testing@example.com',
      password: 'chan@2222',
      firstName: 'tiyu',
      lastName: 'tamoni',
      phoneNumber: '078323456',
      country: 'rwanda',
      currency: 'RWF',
      roles: RolesEnum.Client,
    };

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(userPayload)
      .expect(201);

    const user = await userRepository.findOne({
      where: { email: response.body.email },
    });
    const wallet = await walletRepository.findOne({ where: { id: user.id } });

    expect(user).toBeDefined();
    expect(wallet).toBeDefined();

    expect(user.email).toBe(userPayload.email);
    expect(user.password).toBeUndefined();
    expect(user.firstName).toBe(userPayload.firstName);
    expect(user.lastName).toBe(userPayload.lastName);
    expect(user.phoneNumber).toBe(userPayload.phoneNumber);
    expect(user.country).toBe(userPayload.country);
    expect(user.currency).toBe(userPayload.currency);
    expect(user.roles).toBe(userPayload.roles);

    // Check wallet properties
    expect(wallet.currency).toBe(userPayload.currency);
    expect(wallet.balance).toBe(0);
  });

  afterAll(async () => {
    await walletTransactionRepository.delete({});
    await walletRepository.delete({});
    await userRepository.delete({});
    await app.close();
  });
});
