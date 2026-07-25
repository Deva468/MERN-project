import { useState } from "react";

function AddTicket() {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [issue, setIssue] = useState("");
  const [priority, setPriority] = useState("Low");

  async function handleSubmit(e) {
    e.preventDefault();

    const ticket = {
      name,
      department,
      issue,
      priority,
    };

    try {
      const response = await fetch("http://localhost:5000/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ticket),
      });

      const data = await response.json();

      alert(data.message);

      setName("");
      setDepartment("");
      setIssue("");
      setPriority("Low");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
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