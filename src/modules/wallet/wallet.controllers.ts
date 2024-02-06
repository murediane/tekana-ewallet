import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Param,
  Req,
  Res,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { WalletsService } from './wallet.service';
import { Wallet } from './entities/wallet.entity';
import { Roles } from '../../shared/decorators/role.decorator';
import { RolesGuard } from '../authentication/guards/roles.guards';
import { JWTAuthGuard } from '../authentication/guards/jwt-auth-guard';
import { AppEnums } from '../../common/enum';
import { TopupwalletRequestDTO, TransferRequestDTO } from './wallet.dto';
import { UtilService } from '../../common/util.service';

@Controller('wallet')
export class WalletsController {
  constructor(
    private readonly walletsService: WalletsService,

    private utilService: UtilService,
  ) {}
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Get()
  @Roles(AppEnums.RolesEnum.Admin, AppEnums.RolesEnum.Agent)
  async findAll(): Promise<Wallet[]> {
    return this.walletsService.findAllWallets();
  }

  @UseGuards(JWTAuthGuard)
  @Get('/user-email/:email')
  findWalletByUserEmail(@Param('email') email: string, @Req() request) {
    return this.walletsService.findWalletByUserEmail(email, request.user);
  }

  @UseGuards(JWTAuthGuard)
  @Post('/admin-topup/:id')
  @Roles(
    AppEnums.RolesEnum.Admin,
    AppEnums.RolesEnum.Agent,
    AppEnums.RolesEnum.SuperAdmin,
  )
  async adminTopUpWallet(
    @Res() response: any,
    @Param('id') walletId: number,
    @Body() topupwalletRequestDTO: TopupwalletRequestDTO,
    @Req() request,
  ) {
    try {
      const walletTopupResult = await this.walletsService.adminTopUpWallet(
        walletId,
        topupwalletRequestDTO,
        request.user,
      );

      return this.utilService.sendResponse(
        response,
        HttpStatus.CREATED,
        walletTopupResult,
      );
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof NotFoundException
      ) {
        this.utilService.sendResponse(
          response,
          error.getStatus(),
          error.getResponse(),
        );
      } else {
        // For other types of errors, you might want to send a generic error response
        this.utilService.sendResponse(
          response,
          HttpStatus.INTERNAL_SERVER_ERROR,
          {
            message: `ooops,something went wrong,Internal server error, ${error} `,
          },
        );
      }
    }
  }

  @UseGuards(JWTAuthGuard)
  @Post('/transfer')
  async transferFunds(
    @Res() response: any,

    @Body() transferRequestDTO: TransferRequestDTO,

    @Req() req,
  ) {
    const senderUserId = req.user.id;

    try {
      const transferResponse = await this.walletsService.transferFunds(
        senderUserId,
        transferRequestDTO,
      );
      this.utilService.sendResponse(
        response,
        HttpStatus.CREATED,
        transferResponse,
      );
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        this.utilService.sendResponse(
          response,
          error.getStatus(),
          error.getResponse(),
        );
      } else {
        this.utilService.sendResponse(
          response,
          HttpStatus.INTERNAL_SERVER_ERROR,
          { message: 'ooops,something went wrong,Internal server error' },
        );
      }
    }
  }

  @UseGuards(JWTAuthGuard, RolesGuard)
  @Get('transaction/wallet/:walletId')
  @Roles(
    AppEnums.RolesEnum.Admin,
    AppEnums.RolesEnum.Agent,
    AppEnums.RolesEnum.SuperAdmin,
  )
  async findTransactionsByUserId(@Param('walletId') walletId: number) {
    return this.walletsService.findTransactionsByUserId(walletId);
  }
}
