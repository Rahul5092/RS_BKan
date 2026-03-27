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

const SERVERS = [
  "arsalan ali", "fahad", "Razak", "sunny", "nanu", "Lana", 
  "Riti", "saho", "aanchal", "Tasmin", "Sonia", "Angela", "Grisha"
];

const TIME_SLOTS = Array.from({ length: 48 }).map((_, i) => {
  const hour = Math.floor(i / 2);
  const min = i % 2 === 0 ? "00" : "30";
  const ampm = hour < 12 ? "AM" : "PM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${min} ${ampm}`;
});

interface ReservationFormProps {
  date: Date;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    date: string;
    time?: string;
    server?: string;
    customerName: string;
    phone: string;
    partySize: number;
    status: "confirmed" | "waitlist";
    notes: string;
  }) => Promise<boolean> | boolean;
  editingReservation?: Reservation | null;
}

export function ReservationForm({ date, open, onOpenChange, onSubmit, editingReservation }: ReservationFormProps) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [partySize, setPartySize] = useState("2");
  const [time, setTime] = useState("");
  const [server, setServer] = useState("");
  const [status, setStatus] = useState<"confirmed" | "waitlist">("confirmed");
  const [notes, setNotes] = useState("");
  const [initialized, setInitialized] = useState(false);

  // Populate form when editing
  if (open && editingReservation && !initialized) {
    setCustomerName(editingReservation.customerName);
    setPhone(editingReservation.phone);
    setPartySize(String(editingReservation.partySize));
    setTime(editingReservation.time || "");
    setServer(editingReservation.server || "");
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
    setTime("");
    setServer("");
    setStatus("confirmed");
    setNotes("");
    setInitialized(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) resetForm();
    onOpenChange(isOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !partySize || !time || !server || !status) {
      alert("Please fill in all required fields.");
      return;
    }

    const ok = await onSubmit({
      date: format(date, "yyyy-MM-dd"),
      time: time || undefined,
      server: server || undefined,
      customerName: customerName.trim(),
      phone: phone.trim(),
      partySize: parseInt(partySize) || 2,
      status,
      notes: notes.trim(),
    });

    if (ok) {
      resetForm();
      onOpenChange(false);
    } else {
      alert("Failed to save reservation. Please check Supabase table columns and RLS policies.");
    }
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
            <Label htmlFor="name">Customer Name <span className="text-destructive">*</span></Label>
            <Input id="name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="John Smith" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number <span className="text-destructive">*</span></Label>
            <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 123-4567" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="partySize">Party Size <span className="text-destructive">*</span></Label>
              <Input id="partySize" type="number" min="1" value={partySize} onChange={(e) => setPartySize(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Time <span className="text-destructive">*</span></Label>
              <Select value={time} onValueChange={setTime} required>
                <SelectTrigger id="time">
                  <SelectValue placeholder="Select time..." />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {TIME_SLOTS.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Server <span className="text-destructive">*</span></Label>
              <Select value={server} onValueChange={setServer} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select server..." />
                </SelectTrigger>
                <SelectContent>
                  {SERVERS.map(s => (
                    <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status <span className="text-destructive">*</span></Label>
              <Select value={status} onValueChange={(v) => setStatus(v as "confirmed" | "waitlist")} required>
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
