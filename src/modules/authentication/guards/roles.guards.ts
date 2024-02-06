// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { RolesEnum } from 'src/modules/user/user.entity';

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
//     const roles = this.reflector.get<RolesEnum[]>(
//       'roles',
//       context.getHandler(),
//     );
//     if (!roles) {
//       return false;
//     }
//     const request = context.switchToHttp().getRequest();
//     const user = request.user;
//     return roles.some((role) => user.roles?.includes(role));
//   }
// }

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppEnums } from 'src/common/enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<(typeof AppEnums.RolesEnum)[]>(
      'roles',
      context.getHandler(),
    );
    if (!roles) {
      return false;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return roles.includes(user.role);
  }
}
