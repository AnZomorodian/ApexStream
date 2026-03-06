import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export function UTCClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format as HH:mm:ss UTC
  const formattedTime = format(new Date(time.getTime() + time.getTimezoneOffset() * 60000), 'HH:mm:ss');

  return (
    <div className="flex items-center gap-2 font-display text-muted-foreground tabular-nums tracking-wider text-sm">
      <span className="text-primary font-bold">UTC</span>
      <span>{formattedTime}</span>
    </div>
  );
}
