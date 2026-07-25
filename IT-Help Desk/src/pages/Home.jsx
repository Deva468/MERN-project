import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container">

      <h1>Welcome to IT Help Desk</h1>

      <p>Raise a ticket for your technical issues.</p>

      <Link to="/add">
        <button>Add Ticket</button>
      </Link>

      <Link to="/tickets">
        <button>View Tickets</button>
      </Link>

    </div>
  );
}

export default Home;