import { CanActivate, ExecutionContext, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class MaintenanceGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isMaintenance = (global as any).maintenanceMode;
    
    if (!isMaintenance) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const url = request.url;

    // Allow admin routes, auth verification, and maintenance config to work during maintenance
    if (url.startsWith('/api/admin') || url.startsWith('/api/auth')) {
      return true;
    }

    // In a real application, you might check if `request.user.role === 'ADMIN'`
    // But since our app doesn't have roles, we lock out all normal data fetching endpoints
    
    throw new HttpException(
      'System is under maintenance. Please try again later.',
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
}
