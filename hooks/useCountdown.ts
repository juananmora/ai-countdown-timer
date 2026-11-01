import { useState, useEffect } from 'react';
import { calculateTimeLeft } from './calculateTimeLeft';

export const useCountdown = (targetDate: Date | null) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    if (!targetDate) {
      setTimeLeft(null);
      return;
    }

    setTimeLeft(calculateTimeLeft(targetDate));

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};
