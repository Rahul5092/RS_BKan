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

          return (
            <button
              key={dateKey}
              onClick={() => onSelectDate(day)}
              className={cn(
                "relative flex flex-col items-center justify-start p-1.5 min-h-[72px] rounded-md transition-all text-sm font-body",
                !inMonth && "opacity-30",
                inMonth && "hover:bg-secondary cursor-pointer",
                today && !selected && "ring-1 ring-accent",
                selected && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              <span className={cn("font-medium text-sm", selected && "text-primary-foreground")}>
                {format(day, "d")}
              </span>
              {counts && (
                <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                  {counts.confirmed > 0 && (
                    <span className={cn(
                      "text-[10px] px-1 rounded-sm font-medium",
                      selected ? "bg-primary-foreground/20 text-primary-foreground" : "bg-success/15 text-success"
                    )}>
                      {counts.confirmed}
                    </span>
                  )}
                  {counts.waitlist > 0 && (
                    <span className={cn(
                      "text-[10px] px-1 rounded-sm font-medium",
                      selected ? "bg-primary-foreground/20 text-primary-foreground" : "bg-warning/20 text-warning"
                    )}>
                      {counts.waitlist}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
