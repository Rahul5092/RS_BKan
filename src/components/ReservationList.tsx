import { format } from "date-fns";
import type { Reservation } from "@/types/reservation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Users, Trash2, MessageSquare, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReservationListProps {
  date: Date;
  reservations: Reservation[];
  onDelete: (id: string) => void;
  onEdit: (reservation: Reservation) => void;
  onToggleStatus: (id: string, status: "confirmed" | "waitlist") => void;
}

export function ReservationList({ date, reservations, onDelete, onEdit, onToggleStatus }: ReservationListProps) {
  const sorted = [...reservations].sort((a, b) => {
    if (a.status === "confirmed" && b.status === "waitlist") return -1;
    if (a.status === "waitlist" && b.status === "confirmed") return 1;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  return (
    <div>
      <h2 className="font-display text-lg font-semibold mb-1">
        {format(date, "EEEE, MMMM d")}
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        {reservations.length === 0
          ? "No reservations yet"
          : `${reservations.length} reservation${reservations.length > 1 ? "s" : ""}`}
      </p>

      {sorted.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Click "Add Reservation" to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((r, i) => (
            <div
              key={r.id}
              className="bg-card border rounded-lg p-4 animate-fade-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-body font-semibold text-foreground truncate">{r.customerName}</span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[11px] cursor-pointer transition-colors",
                        r.status === "confirmed"
                          ? "border-success/40 bg-success/10 text-success hover:bg-success/20"
                          : "border-warning/40 bg-warning/10 text-warning hover:bg-warning/20"
                      )}
                      onClick={() => onToggleStatus(r.id, r.status === "confirmed" ? "waitlist" : "confirmed")}
                    >
                      {r.status === "confirmed" ? "Confirmed" : "Waitlist"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {r.date ? `Reservation date: ${format(new Date(r.date), "MMM d, yyyy")}` : "No date set"}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" />
                      {r.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {r.partySize} {r.partySize === 1 ? "guest" : "guests"}
                    </span>
                  </div>
                  {r.notes && (
                    <p className="mt-2 text-sm text-muted-foreground flex items-start gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                      {r.notes}
                    </p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => onEdit(r)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => onDelete(r.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
