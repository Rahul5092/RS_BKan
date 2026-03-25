import { useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  isSameDay,
} from "date-fns";
import { cn } from "@/lib/utils";
import type { Reservation } from "@/types/reservation";
import { getHolidayForDate, isLongWeekend } from "@/lib/holidays";

interface CalendarGridProps {
  currentMonth: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  reservations: Reservation[];
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarGrid({ currentMonth, selectedDate, onSelectDate, reservations }: CalendarGridProps) {
  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const reservationCountMap = useMemo(() => {
    const map: Record<string, { confirmed: number; waitlist: number }> = {};
    reservations.forEach((r) => {
      if (!map[r.date]) map[r.date] = { confirmed: 0, waitlist: 0 };
      map[r.date][r.status]++;
    });
    return map;
  }, [reservations]);

  return (
    <div>
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-center text-xs font-body font-semibold text-muted-foreground py-2 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const counts = reservationCountMap[dateKey];
          const inMonth = isSameMonth(day, currentMonth);
          const today = isToday(day);
          const selected = isSameDay(day, selectedDate);
          const holiday = getHolidayForDate(day);
          const longWeekend = isLongWeekend(day);

          return (
            <button
              key={dateKey}
              onClick={() => onSelectDate(day)}
              className={cn(
                "relative flex flex-col items-center justify-start p-1.5 min-h-[72px] rounded-md transition-all text-sm font-body overflow-hidden",
                !inMonth && "opacity-30",
                inMonth && "hover:bg-secondary cursor-pointer",
                longWeekend && inMonth && !selected && "bg-blue-50/50 hover:bg-blue-100/50 dark:bg-blue-950/20 dark:hover:bg-blue-900/40",
                today && !selected && "ring-1 ring-accent",
                selected && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              <span className={cn("font-medium text-sm", selected && "text-primary-foreground", holiday && !selected && "text-destructive font-bold")}>
                {format(day, "d")}
              </span>
              {holiday && (
                <span 
                  className={cn(
                    "text-[8px] leading-tight text-center mt-0.5 line-clamp-2 px-0.5 w-full",
                    selected ? "text-primary-foreground/90 font-medium" : "text-destructive/90 font-semibold"
                  )} 
                  title={holiday.name}
                >
                  {holiday.name}
                </span>
              )}
              {counts && (counts.confirmed > 0 || counts.waitlist > 0) && (
                <div className="flex mt-1 justify-center">
                  <span className={cn(
                    "text-[10px] px-1.5 rounded-full font-bold min-w-[18px] text-center",
                    selected ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground"
                  )}>
                    {counts.confirmed + counts.waitlist}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
