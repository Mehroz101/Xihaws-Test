'use client';

import { useAuthInitialization } from '@/hooks/useAuthInitialization';

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  useAuthInitialization();
  return <>{children}</>;
}
