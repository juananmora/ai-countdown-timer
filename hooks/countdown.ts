import type { TimeLeft } from '../types';

export const calculateTimeLeft = (targetDate: Date | null, now: Date = new Date()): TimeLeft | null => {
  if (!targetDate) return null;
  if (Number.isNaN(targetDate.getTime()) || Number.isNaN(now.getTime())) {
    throw new RangeError('Target date and current time must be valid dates.');
  }

  const difference = +targetDate - +now;
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
