import { AgencyGuard } from './agency.guard';
import { ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';

describe('AgencyGuard', () => {
  let guard: AgencyGuard;

  beforeEach(() => {
    guard = new AgencyGuard();
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

  it('should throw ForbiddenException when user is a client portal account', () => {
    const ctx = createMockContext({ id: 'client-1', isClient: true });
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('should allow access for normal agency accounts', () => {
    const ctx = createMockContext({ id: 'agency-user-1', email: 'agency@domain.com' });
    expect(guard.canActivate(ctx)).toBe(true);
  });
});
