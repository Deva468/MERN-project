const STORAGE_KEY = "it-help-desk-tickets";
const API_BASE_URL = import.meta.env.VITE_API_URL || "";

function readStoredTickets() {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

function writeStoredTickets(tickets) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
}

export async function getTickets() {
  const storedTickets = readStoredTickets();

  try {
    const response = await fetch(`${API_BASE_URL}/tickets`);
    if (!response.ok) throw new Error("Failed to load tickets");

    const data = await response.json();
    const tickets = Array.isArray(data) ? data : [];
    if (tickets.length > 0 || storedTickets.length === 0) {
      writeStoredTickets(tickets);
      return tickets;
    }
  } catch (error) {
    // fall back to local browser storage
  }

  return storedTickets;
}

export async function addTicket(ticket) {
  const payload = {
    ...ticket,
    status: ticket.status || "Open",
  };

  try {
    const response = await fetch(`${API_BASE_URL}/tickets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Unable to save ticket");

    const data = await response.json();
    const savedTicket = data.ticket || { ...payload, _id: Date.now().toString() };
    const storedTickets = [savedTicket, ...readStoredTickets()];
    writeStoredTickets(storedTickets);
    return { ticket: savedTicket, source: "backend" };
  } catch (error) {
    const fallbackTicket = {
      ...payload,
      _id: payload._id || `${Date.now()}`,
    };
    const storedTickets = [fallbackTicket, ...readStoredTickets()];
    writeStoredTickets(storedTickets);
    return { ticket: fallbackTicket, source: "local" };
  }
}

export async function deleteTicket(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Unable to delete ticket");

    const updatedTickets = readStoredTickets().filter((ticket) => ticket._id !== id);
    writeStoredTickets(updatedTickets);
    return { success: true, source: "backend" };
  } catch (error) {
    const updatedTickets = readStoredTickets().filter((ticket) => ticket._id !== id);
    writeStoredTickets(updatedTickets);
    return { success: true, source: "local" };
  }
}
