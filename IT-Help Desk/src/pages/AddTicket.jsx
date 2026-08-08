import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addTicket } from "../utils/ticketStore";

function AddTicket() {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [issue, setIssue] = useState("");
  const [priority, setPriority] = useState("Low");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const ticket = {
      name,
      department,
      issue,
      priority,
    };

    try {
      const result = await addTicket(ticket);

      alert(result.source === "backend" ? "Ticket Added" : "Ticket saved locally");

      setName("");
      setDepartment("");
      setIssue("");
      setPriority("Low");
      navigate("/tickets");
    } catch (error) {
      console.error(error);
      alert(error.message || "Something went wrong");
    }
  }

  return (
    <div className="container">
      <h2>Add Ticket</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
        />

        <textarea
          placeholder="Describe your issue"
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          required
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <button type="submit">Submit Ticket</button>
      </form>
    </div>
  );
}

export default AddTicket;