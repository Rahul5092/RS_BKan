import { useEffect, useState } from "react";
import type { Reservation } from "@/types/reservation";

const RESERVATIONS_STORAGE_KEY = "reservations";

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const fetchReservations = () => {
    try {
      const raw = localStorage.getItem(RESERVATIONS_STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as Reservation[]) : [];
      setReservations(parsed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error("Failed to load reservations", error);
      setReservations([]);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(reservations));
    } catch (error) {
      console.error("Failed to persist reservations", error);
    }
  }, [reservations]);

  const addReservation = (reservation: Omit<Reservation, "id" | "createdAt">) => {
    const payload: Reservation = {
      id: crypto.randomUUID(),
      ...reservation,
      status: reservation.status ?? "waitlist",
      createdAt: new Date().toISOString(),
    };
    setReservations((prev) => [payload, ...prev]);
  };

  const deleteReservation = (id: string) => {
    setReservations((prev) => prev.filter((r) => r.id !== id));
  };

  const updateReservation = (id: string, updates: Partial<Omit<Reservation, "id" | "createdAt">>) => {
    setReservations((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const getReservationsForDate = (date: string) => {
    return reservations.filter((r) => r.date === date);
  };

  return { reservations, addReservation, deleteReservation, updateReservation, getReservationsForDate };
}

