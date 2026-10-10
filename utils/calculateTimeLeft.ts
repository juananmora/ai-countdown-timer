import { TimeLeft } from '../types';

export const calculateTimeLeft = (
  targetDate: Date | null,
  currentDate: Date = new Date(),
): TimeLeft | null => {
  if (!targetDate) {
    return null;
  }

  const difference = targetDate.getTime() - currentDate.getTime();

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
