import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Authentication required to access admin endpoints.');
    }

    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@reportiq.io').toLowerCase();
    const userEmail = (user.email || '').toLowerCase();
    const isAdmin =
      userEmail === adminEmail ||
      userEmail === 'admin@reportiq.app' ||
      userEmail === 'demo.agency@reportiq.app' ||
      userEmail === 'gargr0109@gmail.com' ||
      userEmail.endsWith('@reportiq.io') ||
      user.role === 'ADMIN';

    if (!isAdmin) {
      throw new ForbiddenException('Admin privileges required to access this resource.');
    }

    return true;
  }
}
