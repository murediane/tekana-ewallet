import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Param,
  Req,
} from '@nestjs/common';
import { WalletsService } from './wallet.service';
import { Wallet } from './entities/wallet.entity';
import { Roles } from '../../shared/decorators/role.decorator';
import { RolesGuard } from '../authentication/guards/roles.guards';
import { JWTAuthGuard } from '../authentication/guards/jwt-auth-guard';
import { RolesEnum } from '../user/user.entity';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Get()
  @Roles(RolesEnum.Admin, RolesEnum.Agent)
  async findAll(): Promise<Wallet[]> {
    return this.walletsService.findAllWallets();
  }

  @UseGuards(JWTAuthGuard)
  @Get('/user-email/:email')
  findWalletByUserEmail(@Param('email') email: string, @Req() request) {
    return this.walletsService.findWalletByUserEmail(email, request.user);
  }

  @UseGuards(JWTAuthGuard, RolesGuard)
  @Post('/admin-topup/:id')
  @Roles(RolesEnum.Admin, RolesEnum.Agent, RolesEnum.SuperAdmin)
  async adminTopUpWallet(
    @Param('id') walletId: number,
    @Body('amount') amount: number,
    @Body('currency') currency: string,
    @Req() request,
  ) {
    return this.walletsService.adminTopUpWallet(
      walletId,
      amount,
      currency,
      request.user,
    );
  }

  @UseGuards(JWTAuthGuard)
  @Post('/transfer')
  async transferFunds(
    @Body('receiverEmail') receiverEmail: string,
    @Body('amount') amount: number,
    @Body('currency') currency: string,
    @Req() req,
  ) {
    const senderUserId = req.user.id;

    return this.walletsService.transferFunds(
      senderUserId,
      receiverEmail,
      amount,
      currency,
    );
  }

  @UseGuards(JWTAuthGuard, RolesGuard)
  @Get('transaction/wallet/:walletId')
  @Roles(RolesEnum.Admin, RolesEnum.Agent, RolesEnum.SuperAdmin)
  async findTransactionsByUserId(@Param('walletId') walletId: number) {
    return this.walletsService.findTransactionsByUserId(walletId);
  }
}
