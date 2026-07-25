import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AddTicket from "./pages/AddTicket";
import ViewTickets from "./pages/ViewTickets";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/add" element={<AddTicket />} />

        <Route path="/tickets" element={<ViewTickets />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;