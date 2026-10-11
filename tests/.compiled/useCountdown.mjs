import { useState, useEffect } from 'react';
export const calculateTimeLeft = (targetDate) => {
    if (!targetDate)
        return null;
    if (Number.isNaN(targetDate.getTime())) {
        throw new RangeError('Invalid target date');
    }
    const difference = +targetDate - +new Date();
    let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
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
export const useCountdown = (targetDate) => {
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
