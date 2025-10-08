import React from 'react';

interface TimeUnitProps {
  value: number;
  label: string;
}

const TimeUnit: React.FC<TimeUnitProps> = ({ value, label }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-sm rounded-xl p-4 md:p-6 min-w-[75px] sm:min-w-[120px] md:min-w-[150px] shadow-2xl border border-indigo-500/20">
      <span
        key={value}
        className="text-5xl sm:text-7xl md:text-8xl font-bold text-indigo-300 tracking-wider animate-tick"
        style={{ fontFamily: "'Roboto Mono', monospace", fontVariantNumeric: 'tabular-nums' }}
      >
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-xs sm:text-base md:text-lg font-light text-slate-400 uppercase tracking-widest mt-2">
        {label}
      </span>
    </div>
  );
};

export default TimeUnit;