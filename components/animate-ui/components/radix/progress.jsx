import * as React from 'react';

import {
  Progress as ProgressPrimitive,
  ProgressIndicator as ProgressIndicatorPrimitive,
} from '@/components/animate-ui/primitives/radix/progress';
import { cn } from '@/lib/utils';

function Progress({
  className,
  ...props
}) {
  return (
    <ProgressPrimitive
      className={cn(
        'bg-white/10 relative h-2 w-full overflow-hidden rounded-full',
        className
      )}
      {...props}>
      <ProgressIndicatorPrimitive
        className="gradient-title rounded-full h-full w-full flex-1 transition-all duration-500 ease-in-out"
        style={{
          transform: `translateX(-${100 - (props.value || 0)}%)`,
          WebkitBackgroundClip: 'padding-box',
          WebkitTextFillColor: 'initial'
        }}
      />
    </ProgressPrimitive>
  );
}

export { Progress };
