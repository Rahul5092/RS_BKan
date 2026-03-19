import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserPlus, Pencil } from "lucide-react";
import type { Reservation } from "@/types/reservation";

interface ReservationFormProps {
  date: Date;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    date: string;
    customerName: string;
    phone: string;
    partySize: number;
    status: "confirmed" | "waitlist";
    notes: string;
  }) => void;
  editingReservation?: Reservation | null;
}

export function ReservationForm({ date, open, onOpenChange, onSubmit, editingReservation }: ReservationFormProps) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [partySize, setPartySize] = useState("2");
  const [status, setStatus] = useState<"confirmed" | "waitlist">("confirmed");
  const [notes, setNotes] = useState("");
  const [initialized, setInitialized] = useState(false);

  // Populate form when editing
  if (open && editingReservation && !initialized) {
    setCustomerName(editingReservation.customerName);
    setPhone(editingReservation.phone);
    setPartySize(String(editingReservation.partySize));
    setStatus(editingReservation.status);
    setNotes(editingReservation.notes);
    setInitialized(true);
  }

  if (open && !editingReservation && !initialized) {
    setInitialized(true);
  }

  const resetForm = () => {
    setCustomerName("");
    setPhone("");
    setPartySize("2");
    setStatus("confirmed");
    setNotes("");
    setInitialized(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) resetForm();
    onOpenChange(isOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim()) return;

    onSubmit({
      date: format(date, "yyyy-MM-dd"),
      customerName: customerName.trim(),
      phone: phone.trim(),
      partySize: parseInt(partySize) || 2,
      status,
      notes: notes.trim(),
    });

    resetForm();
    onOpenChange(false);
  };

  const isEditing = !!editingReservation;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-xl">
            {isEditing ? <Pencil className="h-5 w-5 text-primary" /> : <UserPlus className="h-5 w-5 text-primary" />}
            {isEditing ? "Edit Reservation" : "New Reservation"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground font-body">
            {format(date, "EEEE, MMMM d, yyyy")}
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="name">Customer Name</Label>
            <Input id="name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="John Smith" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 123-4567" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="partySize">Party Size</Label>
              <Input id="partySize" type="number" min="1" max="50" value={partySize} onChange={(e) => setPartySize(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as "confirmed" | "waitlist")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="waitlist">Waitlist</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes & Comments</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Allergies, special requests, seating preference..." rows={3} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
            <Button type="submit">{isEditing ? "Save Changes" : "Add Reservation"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
