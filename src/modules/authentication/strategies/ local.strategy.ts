import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from '../../users/user.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({ usernameField: 'email' }); // Use email field as the username
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    console.log(user);
    if (!user) {
      throw new UnauthorizedException();
    }
    const isPasswordMatching = await bcrypt.compare(password, user.password);
    console.log(isPasswordMatching);
    if (!isPasswordMatching) {
      throw new UnauthorizedException();
    }
    console.log(' ghhhhdfdgdgdgdgdgdgdgdgd',user)
    return user;
  }
}
