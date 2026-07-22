import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { User } from '@prisma/client';

// Account approval gate. Off by default so that during the TikTok API audit
// window everything behaves like stock Postiz. The operator flips it on after
// approval by setting REQUIRE_ACCOUNT_APPROVAL=true and maintaining the
// APPROVED_ACCOUNTS allowlist. Approval state is purely "is this email on the
// allowlist" so there is no schema or migration to carry.

export const APPROVAL_PENDING_MESSAGE =
  'Your account is awaiting approval. We will email you when it is ready.';

export function isApprovalGateActive(): boolean {
  return process.env.REQUIRE_ACCOUNT_APPROVAL === 'true';
}

export function getApprovedAccounts(): string[] {
  return (process.env.APPROVED_ACCOUNTS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isEmailApproved(email?: string | null): boolean {
  if (!email) {
    return false;
  }
  return getApprovedAccounts().includes(email.trim().toLowerCase());
}

// Pending means the gate is active and the email is not on the allowlist. When
// the gate is inactive nobody is ever pending, which keeps the audit-window
// state airtight.
export function isAccountPending(email?: string | null): boolean {
  return isApprovalGateActive() && !isEmailApproved(email);
}

@Injectable()
export class AccountApprovalGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    if (!isApprovalGateActive()) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    // Read-only browsing stays open so a pending user can look around; only
    // state-changing requests (connecting channels, creating/scheduling posts)
    // are blocked.
    if (request.method === 'GET') {
      return true;
    }

    // @ts-ignore populated by AuthMiddleware
    const user = request.user as User | undefined;
    if (isAccountPending(user?.email)) {
      throw new ForbiddenException(APPROVAL_PENDING_MESSAGE);
    }

    return true;
  }
}
