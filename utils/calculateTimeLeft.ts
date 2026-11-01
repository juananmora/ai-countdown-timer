import type { TimeLeft } from '../types';

export const calculateTimeLeft = (
  targetDate: Date | null,
  now: Date = new Date(),
): TimeLeft | null => {
  if (!targetDate) return null;
  if (!Number.isFinite(targetDate.getTime()) || !Number.isFinite(now.getTime())) {
    throw new RangeError('Target date and current time must be valid dates.');
  }

  const difference = targetDate.getTime() - now.getTime();
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};
