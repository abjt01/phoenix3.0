import * as React from 'react';

import {
  Progress as ProgressPrimitive,
  ProgressIndicator as ProgressIndicatorPrimitive,
} from '@/components/animate-ui/primitives/radix/progress';
import { cn } from '@/lib/utils';

function Progress({
  className,
  value,
  ...props
}) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // Add a tiny delay before enabling transitions to ensure initial render is instant
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ProgressPrimitive
      className={cn(
        'bg-white/10 relative h-2 w-full overflow-hidden rounded-full',
        className
      )}
      {...props}>
      <ProgressIndicatorPrimitive
        className="gradient-title rounded-full h-full w-full flex-1"
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`,
          WebkitBackgroundClip: 'padding-box',
          WebkitTextFillColor: 'initial',
          transition: mounted ? 'transform 300ms ease-out' : 'none'
        }}
      />
    </ProgressPrimitive>
  );
}

export { Progress };
