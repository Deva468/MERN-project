import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "1rem", background: "#f3f4f6", marginBottom: "1rem" }}>
      <Link to="/" style={{ marginRight: "1rem" }}>Home</Link>
      <Link to="/add" style={{ marginRight: "1rem" }}>Add Ticket</Link>
      <Link to="/tickets">View Tickets</Link>
    </nav>
  );
}

export default Navbar;
