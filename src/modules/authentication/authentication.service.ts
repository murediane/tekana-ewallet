import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    console.log ('gggggggg', user);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user._id , password :user.password};
    console.log('jjjjjjjj', payload);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
