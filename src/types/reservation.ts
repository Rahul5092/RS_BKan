export interface Reservation {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  customerName: string;
  phone: string;
  partySize: number;
  status: "confirmed" | "waitlist";
  notes: string;
  createdAt: string;
}
