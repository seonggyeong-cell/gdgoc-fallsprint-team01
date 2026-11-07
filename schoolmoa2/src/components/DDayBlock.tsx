import React from 'react';
import { calculateDDay } from '../utils/dateUtils';

interface DDayBlockProps {
  deadline: string;
  isOngoing?: boolean;
  size?: 'normal' | 'sm' | 'lg';
  className?: string;
}

export const DDayBlock: React.FC<DDayBlockProps> = ({
  deadline,
  isOngoing,
  size = 'normal',
  className = '',
}) => {
  const d = calculateDDay(deadline, isOngoing);

  if (size === 'sm') {
    return (
      <div
        className={`flex flex-col items-center justify-center w-[48px] h-[48px] rounded-[10px] border shrink-0 text-center select-none ${className}`}
        style={{
          backgroundColor: d.bgColor,
          borderColor: d.borderColor,
          color: d.textColor,
        }}
      >
        <span className="text-[15px] font-extrabold leading-none tabular-nums tracking-tight">
          {d.dDayText}
        </span>
        <span className="text-[10px] font-medium leading-none mt-1 opacity-80 tabular-nums">
          {d.mmDd}
        </span>
      </div>
    );
  }

  if (size === 'lg') {
    return (
      <div
        className={`flex flex-col items-center justify-center w-[64px] h-[64px] rounded-[12px] border shrink-0 text-center select-none shadow-xs ${className}`}
        style={{
          backgroundColor: d.bgColor,
          borderColor: d.borderColor,
          color: d.textColor,
        }}
      >
        <span className="text-[24px] font-extrabold leading-none tabular-nums tracking-tight">
          {d.dDayText}
        </span>
        <span className="text-[11px] font-semibold leading-none mt-1.5 opacity-85 tabular-nums">
          {d.mmDd}
        </span>
      </div>
    );
  }

  // Default: 58px square as per PDF specification
  return (
    <div
      className={`flex flex-col items-center justify-center w-[58px] h-[58px] rounded-[12px] border shrink-0 text-center select-none ${className}`}
      style={{
        backgroundColor: d.bgColor,
        borderColor: d.borderColor,
        color: d.textColor,
      }}
      title={`마감일: ${deadline || '상시'}`}
    >
      <span className="text-[19px] font-extrabold leading-none tabular-nums tracking-tight">
        {d.dDayText}
      </span>
      <span className="text-[11px] font-medium leading-none mt-1.5 opacity-85 tabular-nums">
        {d.mmDd}
      </span>
    </div>
  );
};
