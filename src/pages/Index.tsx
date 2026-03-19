import { useState } from "react";
import { addMonths, subMonths, format } from "date-fns";
import { ChevronLeft, ChevronRight, Plus, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarGrid } from "@/components/CalendarGrid";
import { ReservationForm } from "@/components/ReservationForm";
import { ReservationList } from "@/components/ReservationList";
import { useReservations } from "@/hooks/useReservations";
import type { Reservation } from "@/types/reservation";

const Index = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formOpen, setFormOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);

  const { reservations, addReservation, deleteReservation, updateReservation, getReservationsForDate } = useReservations();

  const selectedDateKey = format(selectedDate, "yyyy-MM-dd");
  const dateReservations = getReservationsForDate(selectedDateKey);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-6xl flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-7 w-7 text-primary" />
            <div>
              <h1 className="text-xl font-display font-bold text-foreground leading-tight">Reservations</h1>
              <p className="text-xs text-muted-foreground font-body">Restaurant Booking Calendar</p>
            </div>
          </div>
          <Button onClick={() => setFormOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Reservation
          </Button>
        </div>
      </header>

      <main className="container max-w-6xl py-6">
        <div className="grid lg:grid-cols-[1fr_380px] gap-6">
          {/* Calendar */}
          <div className="bg-card border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-semibold">
                {format(currentMonth, "MMMM yyyy")}
              </h2>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-xs h-8" onClick={() => { setCurrentMonth(new Date()); setSelectedDate(new Date()); }}>
                  Today
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CalendarGrid
              currentMonth={currentMonth}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              reservations={reservations}
            />
          </div>

          {/* Reservation List */}
          <div className="bg-card border rounded-xl p-5">
            <ReservationList
              date={selectedDate}
              reservations={dateReservations}
              onDelete={deleteReservation}
              onEdit={(r) => { setEditingReservation(r); setFormOpen(true); }}
              onToggleStatus={(id, newStatus) => updateReservation(id, { status: newStatus })}
            />
          </div>
        </div>
      </main>

      <ReservationForm
        date={selectedDate}
        open={formOpen}
        onOpenChange={(open) => { setFormOpen(open); if (!open) setEditingReservation(null); }}
        editingReservation={editingReservation}
        onSubmit={(data) => {
          if (editingReservation) {
            updateReservation(editingReservation.id, data);
          } else {
            addReservation(data);
          }
        }}
      />
    </div>
  );
};

export default Index;
