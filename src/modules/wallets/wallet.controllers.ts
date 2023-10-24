import { Body, Controller, Post, UseGuards ,Get, Param} from '@nestjs/common';
import { WalletsService } from './wallet.service';
import { WalletDocument } from './wallet.schema';
import { Roles } from 'src/shared/decorators/role.decorator';
import { RolesGuard } from '../authentication/guards/roles.guards';
import { JWTAuthGuard }  from '../authentication/guards/jwt-auth-guard'


@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}
  @Get()
  async findAll(): Promise<WalletDocument[]> {
    return this.walletsService.findAllWallets();
  }

  @UseGuards(JWTAuthGuard)
  @Get('/user-email/:email')

  findWalletByUserEmail(@Param('email') email: string) {
    return this.walletsService.findWalletByUserEmail(email);
  }
}