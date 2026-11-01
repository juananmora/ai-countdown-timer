import type { TimeLeft } from '../types';

export const calculateTimeLeft = (targetDate: Date | null, now: Date = new Date()): TimeLeft | null => {
  if (targetDate === null) return null;

  const targetTime = targetDate.getTime();
  const currentTime = now.getTime();
  if (!Number.isFinite(targetTime)) {
    throw new RangeError('targetDate must be a valid date');
  }
  if (!Number.isFinite(currentTime)) {
    throw new RangeError('now must be a valid date');
  }

  const difference = targetTime - currentTime;
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
