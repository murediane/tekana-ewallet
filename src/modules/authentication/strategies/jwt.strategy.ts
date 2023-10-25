
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/user.service';
import configuration from 'src/config/configuration';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configuration().jwt.secret,
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findByEmail(payload.username); // 'username' should match the field you used when signing the JWT
    if (!user) {
      throw new UnauthorizedException();
    }
    return user; 
  }
}
