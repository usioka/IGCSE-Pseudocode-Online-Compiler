// Route shim only — Next.js App Router requires page files under src/app/,
// so this one file can't live in app/src/watchdog/ with the rest of the
// watchdog code. All real logic is in ../../watchdog/ui/WatchdogChecker.

import WatchdogChecker from '@/watchdog/ui/WatchdogChecker';

export default function WatchdogPage() {
  return <WatchdogChecker />;
}
