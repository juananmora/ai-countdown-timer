import type { TimeLeft } from '../types';

export const calculateTimeLeft = (targetDate: Date | null): TimeLeft | null => {
  if (!targetDate) return null;

  const targetTimestamp = targetDate.getTime();
  if (!Number.isFinite(targetTimestamp)) {
    throw new RangeError('targetDate must be a valid date');
  }

  const difference = targetTimestamp - +new Date();
  let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};
