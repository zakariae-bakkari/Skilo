'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Coins } from 'lucide-react';
import { creditsApi } from '@/lib/api';
import type { CreditBalance } from '@/lib/api';

export function CreditsPill() {
  const [balance, setBalance] = useState<CreditBalance | null>(null);

  useEffect(() => {
    creditsApi.balance().then(setBalance).catch(() => {});
  }, []);

  if (!balance) return null;

  return (
    <Link
      href="/credits"
      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all text-amber-600 dark:text-amber-500 shadow-sm"
    >
      <Coins className="w-4 h-4" />
      <span className="text-sm font-semibold">{balance.available}</span>
      {balance.reserved > 0 && (
        <span className="text-[10px] opacity-75 font-bold">+{balance.reserved} RES</span>
      )}
    </Link>
  );
}
