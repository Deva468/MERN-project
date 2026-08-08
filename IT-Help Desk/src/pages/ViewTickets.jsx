import { useEffect, useState } from "react";
import { deleteTicket, getTickets } from "../utils/ticketStore";

function ViewTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadTickets() {
      try {
        const data = await getTickets();

        if (!ignore) {
          setTickets(Array.isArray(data) ? data : []);
          setError("");
        }
      } catch (err) {
        if (!ignore) {
          console.error(err);
          setError(err.message || "Could not load tickets");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadTickets();

    return () => {
      ignore = true;
    };
  }, []);

  async function handleDelete(id) {
    const result = await deleteTicket(id);
    if (result.success) {
      setTickets((prev) => prev.filter((ticket) => ticket._id !== id));
    }
  }

  return (
    <div className="container">
      <h2>Support Tickets</h2>

      {loading && <p>Loading tickets...</p>}
      {error && <p>{error}</p>}

      {!loading && tickets.length === 0 && <p>No Tickets Found</p>}

      {!loading && tickets.length > 0 && (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Issue</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket._id}>
                <td>{ticket.name}</td>
                <td>{ticket.department}</td>
                <td>{ticket.issue}</td>
                <td>{ticket.priority}</td>
                <td>{ticket.status || "Open"}</td>
                <td>
                  <button onClick={() => handleDelete(ticket._id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ViewTickets;
