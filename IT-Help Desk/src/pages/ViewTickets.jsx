import { useEffect, useState } from "react";

function ViewTickets() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/tickets")
      .then((res) => res.json())
      .then((data) => setTickets(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="container">
      <h2>All Tickets</h2>

      {tickets.length === 0 ? (
        <p>No Tickets Found</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Issue</th>
              <th>Priority</th>
            </tr>
          </thead>

          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket._id}>
                <td>{ticket.name}</td>
                <td>{ticket.department}</td>
                <td>{ticket.issue}</td>
                <td>{ticket.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ViewTickets;