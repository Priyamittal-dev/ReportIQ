import { AdminGuard } from './admin.guard';
import { ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';

describe('AdminGuard', () => {
  let guard: AdminGuard;

  beforeEach(() => {
    guard = new AdminGuard();
  });

  const createMockContext = (user: any): ExecutionContext => ({
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  } as any);

  it('should throw UnauthorizedException when no user is present', () => {
    const ctx = createMockContext(null);
    expect(() => guard.canActivate(ctx)).toThrow(UnauthorizedException);
  });

  it('should throw ForbiddenException when user email starts with admin@ but is not an authorized domain', () => {
    const ctx = createMockContext({ email: 'admin@attacker.com' });
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('should allow access when user has @reportiq.io email', () => {
    const ctx = createMockContext({ email: 'admin@reportiq.io' });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('should allow access when user role is ADMIN', () => {
    const ctx = createMockContext({ email: 'john@custom.com', role: 'ADMIN' });
    expect(guard.canActivate(ctx)).toBe(true);
  });
});
