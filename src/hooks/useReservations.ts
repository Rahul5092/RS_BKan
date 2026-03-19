import { useState, useEffect } from "react";
import type { Reservation } from "@/types/reservation";

const STORAGE_KEY = "restaurant-reservations";

function loadReservations(): Reservation[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>(loadReservations);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
  }, [reservations]);

  const addReservation = (reservation: Omit<Reservation, "id" | "createdAt">) => {
    const newReservation: Reservation = {
      ...reservation,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setReservations((prev) => [...prev, newReservation]);
  };

  const deleteReservation = (id: string) => {
    setReservations((prev) => prev.filter((r) => r.id !== id));
  };

  const updateReservation = (id: string, updates: Partial<Omit<Reservation, "id" | "createdAt">>) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  const getReservationsForDate = (date: string) => {
    return reservations.filter((r) => r.date === date);
  };

  return { reservations, addReservation, deleteReservation, updateReservation, getReservationsForDate };
}
