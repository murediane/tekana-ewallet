import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RolesEnum, User } from '../src/modules/user/user.entity';
import { Wallet } from '../src/modules/wallet/entities/wallet.entity';
import { WalletTransaction } from '../src/modules/wallet/entities/transactions.entity';
import { Repository } from 'typeorm';

describe('eWallet Test (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let walletRepository: Repository<Wallet>;
  let walletTransactionRepository: Repository<WalletTransaction>;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userRepository = moduleFixture.get(getRepositoryToken(User));
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

    expect(user).toBeDefined();

    expect(user.email).toBe(userPayload.email);
    expect(user.firstName).toBe(userPayload.firstName);
    expect(user.lastName).toBe(userPayload.lastName);
    expect(user.phoneNumber).toBe(userPayload.phoneNumber);
    expect(user.country).toBe(userPayload.country);
    expect(user.currency).toBe(userPayload.currency);
    expect(user.roles).toBe(userPayload.roles);

    // Check wallet properties
    expect(user.wallet.currency).toBe(userPayload.currency);
    expect(user.wallet.balance).toBe(0);
  });

  it('/users/admin (POST)', async () => {
    //create admin user
    const hashedPassword = await bcrypt.hash('chan@2222', 10);
    const superAdminPayload = {
      username: 'kiki',
      email: 'superadmin@example.com',
      password: hashedPassword,
      firstName: 'tiyu',
      lastName: 'tamoni',
      phoneNumber: '078323456',
      country: 'rwanda',
      currency: 'RWF',
      roles: RolesEnum.SuperAdmin,
    };

    // manually create a superadmin
    await userRepository.save(superAdminPayload);

    // log in as admin user
    const adminLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'superadmin@example.com',
        password: 'chan@2222',
      })
      .expect(201);

    const adminPayload = {
      username: 'john',
      email: 'admin@example.com',
      password: hashedPassword,
      firstName: 'john',
      lastName: 'paul',
      phoneNumber: '078323334',
      country: 'rwanda',
      currency: 'RWF',
      roles: RolesEnum.Admin,
    };

    // Use supertest to send a request to the create admin endpoint
    const authToken = adminLogin.body.access_token;
    const createAdminResponse = await request(app.getHttpServer())
      .post('/users/admin')
      .set('Authorization', `Bearer ${authToken}`)
      .send(adminPayload);

    expect(createAdminResponse.status).toBe(HttpStatus.CREATED);
    expect(createAdminResponse.body).toHaveProperty(
      'email',
      adminPayload.email,
    );
  });
  it('/users (GET) - Should return all users for admin or superadmin', async () => {
    // Log in as an admin user to get the JWT token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'superadmin@example.com',
        password: 'chan@2222',
      });

    const authToken = loginResponse.body.access_token;

    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toBeDefined();
    expect(Array.isArray(response.body)).toBeTruthy();

    const firstUser = response.body[0];
    expect(firstUser).toHaveProperty('email');
    expect(firstUser).toHaveProperty('firstName');
    expect(firstUser).toHaveProperty('lastName');
    expect(firstUser).toHaveProperty('phoneNumber');
    expect(firstUser).toHaveProperty('country');
    expect(firstUser).toHaveProperty('roles');
    expect(firstUser).toHaveProperty('lastName');
    expect(firstUser).toHaveProperty('phoneNumber');
    expect(firstUser).toHaveProperty('country');
    expect(firstUser).toHaveProperty('roles');
    expect(firstUser).toHaveProperty('wallet');
  });
  it('/wallets/user-email/:email (GET) - should return the wallet for the specified user', async () => {
    // Create a user
    const userPayload = {
      email: 'uniq@example.com',
      password: 'chan@2222',
      firstName: 'tiyu',
      lastName: 'tamoni',
      phoneNumber: '078323456',
      country: 'rwanda',
      currency: 'RWF',
      roles: RolesEnum.Client,
    };
    const createdUser = await userRepository.save(userPayload);

    // Create a wallet for the user
    const walletPayload = {
      currency: 'RWF',
      balance: 100,
      user: createdUser,
    };
    const createdWallet = await walletRepository.save(walletPayload);

    // Log in as the user to get the JWT token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'superadmin@example.com',
        password: 'chan@2222',
      })
      .expect(HttpStatus.CREATED);

    const authToken = loginResponse.body.access_token;

    // Make a request to get the wallet by user email
    const response = await request(app.getHttpServer())
      .get(`/wallets/user-email/${userPayload.email}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.OK);

    expect(response.body).toBeDefined();
    expect(response.body.currency).toBe(createdWallet.currency);
    expect(response.body.balance).toBe(createdWallet.balance);
  });

  it('/wallets/user-email/:email (GET) - should return 403 Forbidden if the user does not have permission', async () => {
    // Create a user
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
    const userPayload2 = {
      email: 'testinger@example.com',
      password: 'chan@2222',
      firstName: 'tiyu',
      lastName: 'tamoni',
      phoneNumber: '078323456',
      country: 'rwanda',
      currency: 'RWF',
      roles: RolesEnum.Client,
    };
    await userRepository.save(userPayload);
    await userRepository.save(userPayload2);

    // Log in as a different user to get the JWT token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'testinger@example.com',
        password: 'chan@2222',
      });

    const authToken = loginResponse.body.access_token;

    // Make a request to get the wallet by user email (using a different user's email)
    await request(app.getHttpServer())
      .get(`/wallets/user-email/${userPayload.email}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('/wallets/user-email/:email (GET) - should return 404 Not Found if the user does not exist', async () => {
    // Log in as an admin user to get the JWT token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'superadmin@example.com',
        password: 'chan@2222',
      })
      .expect(HttpStatus.CREATED);
    const authToken = loginResponse.body.access_token;

    // Make a request to get the wallet by non-existent user email
    await request(app.getHttpServer())
      .get('/wallets/user-email/nonexistent@example.com')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(HttpStatus.NOT_FOUND);
  });
  it("/wallets/admin-topup/:id (POST) - should successfully top up a user's wallet by an admin", async () => {
    // Create an admin user
    const hashedPassword = await bcrypt.hash('admin@123', 10);
    const adminPayload = {
      username: 'john',
      email: 'superadmin@gmail.com',
      password: hashedPassword,
      firstName: 'john',
      lastName: 'paul',
      phoneNumber: '078323334',
      country: 'rwanda',
      currency: 'RWF',
      roles: RolesEnum.Admin,
    };
    await userRepository.save(adminPayload);

    // Create a user
    const userPayload = {
      email: 'joh@example.com',
      password: 'chan@2222',
      firstName: 'tiyu',
      lastName: 'tamoni',
      phoneNumber: '078323456',
      country: 'rwanda',
      currency: 'RWF',
      roles: RolesEnum.Client,
    };
    const userResponse = await request(app.getHttpServer())
      .post('/users')
      .send(userPayload)
      .expect(201);

    // Log in as the admin to get the JWT token
    const adminLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'superadmin@gmail.com',
        password: 'admin@123',
      })
      .expect(HttpStatus.CREATED);

    const authToken = adminLogin.body.access_token;

    // Make a request to top up the user's wallet
    const topUpResponse = await request(app.getHttpServer())
      .post(`/wallets/admin-topup/${userResponse.body.wallet.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        amount: 5000,
        currency: 'RWF',
      });

    expect(topUpResponse.body).toBeDefined();
    expect(topUpResponse.body.currency).toBe('RWF');
    expect(topUpResponse.body.balance).toBe(5000); // Assuming the user's initial balance was 0
  });

  it('/wallets/admin-topup/:id (POST) - should return 403 Forbidden if the requester is not an admin', async () => {
    // Create a non-admin user

    const userPayload = {
      email: 'john2@example.com',
      password: 'user@123',
      firstName: 'tiyu',
      lastName: 'tamoni',
      phoneNumber: '078323456',
      country: 'rwanda',
      currency: 'RWF',
      roles: RolesEnum.Client,
    };
    const user = await request(app.getHttpServer())
      .post('/users')
      .send(userPayload)
      .expect(201);

    // Log in as the non-admin user to get the JWT token
    const userLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'john2@example.com',
        password: 'user@123',
      })
      .expect(HttpStatus.CREATED);

    const authToken = userLogin.body.access_token;

    // Make a request to top up the user's wallet as a non-admin
    await request(app.getHttpServer())
      .post(`/wallets/admin-topup/${user.body.wallet.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        amount: 50,
        currency: 'USD',
      })
      .expect(HttpStatus.FORBIDDEN);
  });

  it('/wallets/admin-topup/:id (POST) - should return 404 Not Found if the user does not exist', async () => {
    // Log in as an admin to get the JWT token
    const adminLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'superadmin@gmail.com',
        password: 'admin@123',
      })
      .expect(HttpStatus.CREATED);

    const authToken = adminLogin.body.access_token;

    // Make a request to top up the wallet of a non-existent user
    await request(app.getHttpServer())
      .post('/wallets/admin-topup/999')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        amount: 50,
        currency: 'USD',
      })
      .expect(HttpStatus.NOT_FOUND);
  });

  it('/wallets/transfer (POST) - should successfully transfer funds between wallets', async () => {
    const senderLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'joh@example.com',
        password: 'chan@2222',
      })
      .expect(HttpStatus.CREATED);

    const senderAuthToken = senderLogin.body.access_token;

    // Transfer funds from sender to receiver
    const transferResponse = await request(app.getHttpServer())
      .post('/wallets/transfer')
      .set('Authorization', `Bearer ${senderAuthToken}`)
      .send({
        receiverEmail: 'testing@example.com',
        amount: 10,
        currency: 'RWF',
      })
      .expect(HttpStatus.CREATED);

    expect(transferResponse.body).toBeDefined();
    expect(transferResponse.body.amount).toBe(10);
    expect(transferResponse.body.currency).toBe('RWF');
  });

  it('/wallets/transfer (POST) - should return 400 Bad Request if the sender has insufficient funds', async () => {
    // Create a sender user with no funds
    const senderPayload = {
      email: 'sender@example.com',
      password: 'sender@123',
      firstName: 'Sender',
      lastName: 'User',
      phoneNumber: '078323456',
      country: 'rwanda',
      currency: 'RWF',
      roles: RolesEnum.Client,
    };
    await request(app.getHttpServer())
      .post('/users')
      .send(senderPayload)
      .expect(201);

    // Create a receiver user
    const receiverPayload = {
      email: 'receiver@example.com',
      password: 'receiver@123',
      firstName: 'Receiver',
      lastName: 'User',
      phoneNumber: '078323457',
      country: 'rwanda',
      currency: 'RWF',
      roles: RolesEnum.Client,
    };
    await request(app.getHttpServer())
      .post('/users')
      .send(senderPayload)
      .expect(201);
    await request(app.getHttpServer())
      .post('/users')
      .send(receiverPayload)
      .expect(201);

    // Log in as the sender to get the JWT token
    const senderLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'sender@example.com',
        password: 'sender@123',
      })
      .expect(HttpStatus.CREATED);

    const senderAuthToken = senderLogin.body.access_token;

    // Attempt to transfer funds from sender to receiver with insufficient funds
    await request(app.getHttpServer())
      .post('/wallets/transfer')
      .set('Authorization', `Bearer ${senderAuthToken}`)
      .send({
        receiverEmail: 'receiver@example.com',
        amount: 50, // Assuming sender has 0 funds
        currency: 'RWF',
      })
      .expect(HttpStatus.BAD_REQUEST);
  });
  afterAll(async () => {
    await walletTransactionRepository.delete({});
    await walletRepository.delete({});
    await userRepository.delete({});
    await app.close();
  });
});
