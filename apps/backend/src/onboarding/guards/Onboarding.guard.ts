import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { RequestWithUser } from '../../auth/types/request-with-user.type';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * OnboardingGuard — use this on dashboard/app routes (NOT on /auth or /onboarding itself).
 *
 * Usage:
 *   @UseGuards(JwtGuard, OnboardingGuard)   ← always pair with JwtGuard first
 *   @Get('dashboard')
 *   getDashboard() { ... }
 *
 * If the user is not yet onboarded → throws 403 with a redirectTo hint.
 */
@Injectable()
export class OnboardingGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const userId = request.user?.sub;

    if (!userId) return false; // JwtGuard should have caught this already

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { isOnboarded: true },
    });

    if (!user?.isOnboarded) {
      throw new ForbiddenException({
        message: 'Please complete onboarding first',
        redirectTo: '/onboarding',
      });
    }

    return true;
  }
}
