'use client';

import { FC } from 'react';
import { useUser } from '@gitroom/frontend/components/layout/user.context';
import { useT } from '@gitroom/react/translation/get.transation.service.client';

// Closed-beta notice shown while the account approval gate is active and the
// signed-in user is not yet approved. The backend drives this off the same env
// logic, so when the gate is off accountPending is never true and nothing
// renders.
export const ApprovalBanner: FC = () => {
  const user = useUser();
  const t = useT();

  if (!user?.accountPending) return null;

  return (
    <div className="bg-amber-600 text-white px-[16px] py-[8px] text-center rounded-[8px] text-[14px] font-[500]">
      {t(
        'account_awaiting_approval',
        'Psyoc is in closed beta. Your account is awaiting approval, we will email you when it is ready.'
      )}
    </div>
  );
};
