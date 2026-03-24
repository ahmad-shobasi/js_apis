import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { Observable } from 'rxjs';
import { ROLES_KEY } from 'src/common/decorators/user-role.decorator';

const roleHierarchy = {
  ADMIN: 3,
  USER: 2,
  GUEST: 1,
};

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const { user } = context.switchToHttp().getRequest();

    if (!user) throw new ForbiddenException('no user found.');

    // No roles required.
    if (!requiredRoles) return true;

    const userLevel = roleHierarchy[user.role];

    const hasPermission = requiredRoles.some((role) => userLevel >= roleHierarchy[role]);

    if (!requiredRoles.includes(user.role) || !hasPermission) throw new ForbiddenException('Insufficient permissions');

    return true;
  }
}
