import { useEffect, useState } from "react";
import type { Reservation } from "@/types/reservation";
import { supabase } from "@/lib/supabaseClient";

type ReservationRecord = {
  id: string;
  date: string;
  customerName?: string;
  customername?: string;
  phone: string;
  partySize?: number;
  partysize?: number;
  status: "confirmed" | "waitlist";
  notes: string | null;
  createdAt?: string;
  createdat?: string;
};

const toReservation = (row: ReservationRecord): Reservation => ({
  id: row.id,
  date: row.date,
  customerName: row.customerName ?? row.customername ?? "",
  phone: row.phone,
  partySize: row.partySize ?? row.partysize ?? 0,
  status: row.status,
  notes: row.notes ?? "",
  createdAt: row.createdAt ?? row.createdat ?? new Date().toISOString(),
});

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const fetchReservations = async () => {
    const { data, error } = await supabase.from("reservations").select("*");

    if (error) {
      console.error("Failed to load reservations", error);
      return;
    }

    const mapped = ((data as ReservationRecord[]) ?? []).map(toReservation);
    mapped.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setReservations(mapped);
  };

  useEffect(() => {
    fetchReservations();

    const channel = supabase
      .channel("public:reservations")
      .on("postgres_changes", { event: "*", schema: "public", table: "reservations" }, () => fetchReservations())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addReservation = async (reservation: Omit<Reservation, "id" | "createdAt">): Promise<boolean> => {
    const camelPayload = {
      ...reservation,
      status: reservation.status ?? "waitlist",
      createdAt: new Date().toISOString(),
    };
    const snakePayload = {
      date: reservation.date,
      customername: reservation.customerName,
      phone: reservation.phone,
      partysize: reservation.partySize,
      status: reservation.status ?? "waitlist",
      notes: reservation.notes,
      createdat: new Date().toISOString(),
    };

    let { data, error } = await supabase.from("reservations").insert(camelPayload).select();

    if (error) {
      const retry = await supabase.from("reservations").insert(snakePayload).select();
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      console.error("Failed to add reservation", error);
      return false;
    }

    if (data && data.length > 0) {
      setReservations((prev) => [toReservation(data[0] as ReservationRecord), ...prev]);
    } else {
      await fetchReservations();
    }
    return true;
  };

  const deleteReservation = async (id: string): Promise<boolean> => {
    const { error } = await supabase.from("reservations").delete().eq("id", id);

    if (error) {
      console.error("Failed to delete reservation", error);
      return false;
    }

    setReservations((prev) => prev.filter((r) => r.id !== id));
    return true;
  };

  const updateReservation = async (
    id: string,
    updates: Partial<Omit<Reservation, "id" | "createdAt">>
  ): Promise<boolean> => {
    const camelUpdates = { ...updates };
    const snakeUpdates = {
      ...(updates.date !== undefined ? { date: updates.date } : {}),
      ...(updates.customerName !== undefined ? { customername: updates.customerName } : {}),
      ...(updates.phone !== undefined ? { phone: updates.phone } : {}),
      ...(updates.partySize !== undefined ? { partysize: updates.partySize } : {}),
      ...(updates.status !== undefined ? { status: updates.status } : {}),
      ...(updates.notes !== undefined ? { notes: updates.notes } : {}),
    };

    let { data, error } = await supabase.from("reservations").update(camelUpdates).eq("id", id).select();

    if (error) {
      const retry = await supabase.from("reservations").update(snakeUpdates).eq("id", id).select();
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      console.error("Failed to update reservation", error);
      return false;
    }

    if (data && data.length > 0) {
      setReservations((prev) => prev.map((item) => (item.id === id ? toReservation(data[0] as ReservationRecord) : item)));
    } else {
      await fetchReservations();
    }
    return true;
  };

  const getReservationsForDate = (date: string) => {
    return reservations.filter((r) => r.date === date);
  };

  return { reservations, addReservation, deleteReservation, updateReservation, getReservationsForDate };
}

